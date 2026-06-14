"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { createAdminClient, STORAGE_BUCKET } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

async function authorize() {
  const session = await getAdminSession();
  if (!session || !can(session.role, "media:write")) {
    throw new Error("Not authorised to manage media.");
  }
  return session;
}

function mediaTypeFromMime(mime: string): "IMAGE" | "VIDEO" | "PDF" | "DOCUMENT" | "OTHER" {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  if (mime.includes("word") || mime.includes("document") || mime.includes("sheet")) return "DOCUMENT";
  return "OTHER";
}

type Result = { ok: true } | { ok: false; error: string };

export async function uploadMedia(formData: FormData): Promise<Result> {
  const session = await authorize();
  const file = formData.get("file") as File | null;
  const folderId = (formData.get("folderId") as string) || null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!file || file.size === 0) return { ok: false, error: "Choose a file to upload." };
  if (file.size > 25 * 1024 * 1024) return { ok: false, error: "File exceeds the 25MB limit." };

  const supabase = createAdminClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Supabase Storage isn't configured. Use “Add by URL”, or set your Supabase keys in .env.",
    };
  }

  try {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const key = `${new Date().getFullYear()}/${slugify(file.name.replace(/\.[^.]+$/, ""))}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(key, buffer, { contentType: file.type, upsert: false });
    if (upErr) return { ok: false, error: `Upload failed: ${upErr.message}` };

    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);

    await prisma.media.create({
      data: {
        name: file.name,
        type: mediaTypeFromMime(file.type),
        url: pub.publicUrl,
        storageKey: key,
        mimeType: file.type,
        sizeBytes: file.size,
        tags,
        folderId: folderId || undefined,
        uploaderId: session.id.startsWith("dev-") ? undefined : session.id,
      },
    });

    await audit({ actorId: session.id, action: "media.upload", entity: "Media" });
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (e: any) {
    console.error("[uploadMedia]", e);
    return { ok: false, error: "Upload failed unexpectedly." };
  }
}

export async function addMediaByUrl(formData: FormData): Promise<Result> {
  const session = await authorize();
  const url = String(formData.get("url") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim() || url.split("/").pop() || "asset";
  const folderId = (formData.get("folderId") as string) || null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!/^https?:\/\//.test(url)) return { ok: false, error: "Enter a valid http(s) URL." };

  const lower = url.toLowerCase();
  const type = /\.(png|jpe?g|gif|webp|svg|avif)$/.test(lower)
    ? "IMAGE"
    : /\.(mp4|webm|mov)$/.test(lower)
      ? "VIDEO"
      : /\.pdf$/.test(lower)
        ? "PDF"
        : /\.(docx?|xlsx?|pptx?)$/.test(lower)
          ? "DOCUMENT"
          : "OTHER";

  try {
    await prisma.media.create({
      data: {
        name,
        type: type as any,
        url,
        tags,
        folderId: folderId || undefined,
        uploaderId: session.id.startsWith("dev-") ? undefined : session.id,
      },
    });
    await audit({ actorId: session.id, action: "media.addUrl", entity: "Media" });
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (e) {
    console.error("[addMediaByUrl]", e);
    return { ok: false, error: "Could not save — is the database running?" };
  }
}

export async function createFolder(formData: FormData): Promise<Result> {
  const session = await authorize();
  const name = String(formData.get("name") ?? "").trim();
  const parentId = (formData.get("parentId") as string) || null;
  if (!name) return { ok: false, error: "Folder name required." };
  try {
    await prisma.mediaFolder.create({ data: { name, parentId: parentId || undefined } });
    await audit({ actorId: session.id, action: "mediaFolder.create", entity: "MediaFolder" });
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (e) {
    console.error("[createFolder]", e);
    return { ok: false, error: "Could not create folder." };
  }
}

export async function deleteMedia(id: string) {
  const session = await authorize();
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (media?.storageKey) {
      const supabase = createAdminClient();
      if (supabase) await supabase.storage.from(STORAGE_BUCKET).remove([media.storageKey]);
    }
    await prisma.media.delete({ where: { id } });
    await audit({ actorId: session.id, action: "media.delete", entity: "Media", entityId: id });
    revalidatePath("/admin/media");
  } catch (e) {
    console.error("[deleteMedia]", e);
  }
}
