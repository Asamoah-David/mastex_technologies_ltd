import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getMediaLibrary } from "@/lib/admin-queries";
import { isStorageConfigured } from "@/lib/supabase/admin";
import { cn } from "@/lib/utils";
import { MediaToolbar } from "./media-toolbar";
import { MediaGrid } from "./media-grid";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string; q?: string }>;
}) {
  const { folder, q } = await searchParams;
  const { folders, media } = await getMediaLibrary({ folderId: folder, q });
  const storageConfigured = isStorageConfigured();

  return (
    <>
      <PageHeader
        title="Media library"
        description="Images, videos, PDFs and documents — backed by Supabase Storage."
      />

      <MediaToolbar folders={folders as any} storageConfigured={storageConfigured} />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <FolderPill href="/admin/media" active={!folder} label="All" />
          {folders.map((f: any) => (
            <FolderPill
              key={f.id}
              href={`/admin/media?folder=${f.id}`}
              active={folder === f.id}
              label={`${f.name} (${f._count?.media ?? 0})`}
            />
          ))}
        </div>
        <form className="ml-auto flex items-center gap-2" action="/admin/media">
          {folder && <input type="hidden" name="folder" value={folder} />}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q ?? ""} placeholder="Search name or tag" className="h-9 w-56 pl-8" />
          </div>
        </form>
      </div>

      <div className="mt-6">
        <MediaGrid media={media as any} />
      </div>
    </>
  );
}

function FolderPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
