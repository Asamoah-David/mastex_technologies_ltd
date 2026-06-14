import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { can } from "@/lib/rbac";
import { audit } from "@/lib/audit";
import { createAdminClient, STORAGE_BUCKET } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

function mediaType(mime: string): "IMAGE" | "VIDEO" | "PDF" | "DOCUMENT" | "OTHER" {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  if (mime.includes("word") || mime.includes("document") || mime.includes("sheet")) return "DOCUMENT";
  return "OTHER";
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session || !can(session.role, "media:write")) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "File uploads need Supabase Storage configured. Paste an image URL instead, or set your Supabase keys." },
      { status: 503 },
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (!file || file.size === 0) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "File exceeds the 25MB limit." }, { status: 413 });

  try {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const key = `${new Date().getFullYear()}/${slugify(file.name.replace(/\.[^.]+$/, ""))}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(key, buffer, { contentType: file.type, upsert: false });
    if (upErr) return NextResponse.json({ error: `Upload failed: ${upErr.message}` }, { status: 502 });

    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);

    // Also record it in the media library.
    await prisma.media
      .create({
        data: {
          name: file.name,
          type: mediaType(file.type),
          url: pub.publicUrl,
          storageKey: key,
          mimeType: file.type,
          sizeBytes: file.size,
          uploaderId: session.id.startsWith("dev-") ? undefined : session.id,
        },
      })
      .catch(() => {});

    await audit({ actorId: session.id, action: "media.uploadInline", entity: "Media" });
    return NextResponse.json({ url: pub.publicUrl, name: file.name });
  } catch (e) {
    console.error("[admin/upload]", e);
    return NextResponse.json({ error: "Upload failed unexpectedly." }, { status: 500 });
  }
}
