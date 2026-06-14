"use client";

import * as React from "react";
import { ImageUp, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Image field that lets an admin EITHER upload a file (to Supabase Storage via
 * /api/admin/upload) OR paste a URL. Shows a live preview. Falls back to
 * paste-URL when storage isn't configured.
 */
export function ImageUploadField({
  value,
  onChange,
  placeholder = "/images/… or https://",
  compact = false,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div
          className={`relative shrink-0 overflow-hidden rounded-lg border bg-muted ${
            compact ? "size-12" : "size-16"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageUp className="size-5" />
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute right-0.5 top-0.5 inline-flex size-5 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
              Upload
            </Button>
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
