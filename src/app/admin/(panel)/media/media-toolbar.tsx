"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Link2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { uploadMedia, addMediaByUrl, createFolder } from "./actions";

type Mode = null | "upload" | "url" | "folder";

export function MediaToolbar({
  folders,
  storageConfigured,
}: {
  folders: { id: string; name: string }[];
  storageConfigured: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>(null);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setPending(true);
    setError(null);
    const res = await fn();
    setPending(false);
    if (res.ok) {
      setMode(null);
      router.refresh();
    } else {
      setError(res.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setMode(mode === "upload" ? null : "upload")}>
          <Upload className="size-4" /> Upload file
        </Button>
        <Button variant="outline" onClick={() => setMode(mode === "url" ? null : "url")}>
          <Link2 className="size-4" /> Add by URL
        </Button>
        <Button variant="outline" onClick={() => setMode(mode === "folder" ? null : "folder")}>
          <FolderPlus className="size-4" /> New folder
        </Button>
      </div>

      {!storageConfigured && mode === "upload" && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Supabase Storage isn&apos;t configured — file uploads need your Supabase keys in{" "}
          <code>.env</code>. Meanwhile, “Add by URL” works without it.
        </p>
      )}

      {mode === "upload" && (
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(() => uploadMedia(new FormData(e.currentTarget as HTMLFormElement)));
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-1.5 sm:col-span-2">
                <Label>File</Label>
                <Input type="file" name="file" required />
              </div>
              <FolderSelect folders={folders} />
              <div className="space-y-1.5">
                <Label>Tags (comma-separated)</Label>
                <Input name="tags" placeholder="hero, product" />
              </div>
              <div className="sm:col-span-2">
                <Submit pending={pending} label="Upload" />
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {mode === "url" && (
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(() => addMediaByUrl(new FormData(e.currentTarget as HTMLFormElement)));
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-1.5 sm:col-span-2">
                <Label>URL</Label>
                <Input name="url" placeholder="https://…" required />
              </div>
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input name="name" placeholder="Optional" />
              </div>
              <FolderSelect folders={folders} />
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Tags (comma-separated)</Label>
                <Input name="tags" placeholder="hero, product" />
              </div>
              <div className="sm:col-span-2">
                <Submit pending={pending} label="Add" />
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {mode === "folder" && (
        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(() => createFolder(new FormData(e.currentTarget as HTMLFormElement)));
              }}
              className="flex flex-wrap items-end gap-3"
            >
              <div className="space-y-1.5">
                <Label>Folder name</Label>
                <Input name="name" required className="w-56" />
              </div>
              <Submit pending={pending} label="Create folder" />
            </form>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function FolderSelect({ folders }: { folders: { id: string; name: string }[] }) {
  return (
    <div className="space-y-1.5">
      <Label>Folder</Label>
      <select
        name="folderId"
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
      >
        <option value="">— None —</option>
        {folders.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Submit({ pending, label }: { pending: boolean; label: string }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {label}
    </Button>
  );
}
