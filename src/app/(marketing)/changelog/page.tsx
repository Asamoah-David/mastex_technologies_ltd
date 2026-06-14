import Link from "next/link";
import { Section, SectionHeader } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion";
import { Markdown } from "@/components/markdown";
import { getChangelog } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Changelog",
  description: "What's new across the Mastex platform — releases, features and fixes.",
  path: "/changelog",
});

export default async function ChangelogPage() {
  const entries = await getChangelog();

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="What's new"
          title="Changelog"
          description="Every meaningful release across the Mastex product suite."
        />
      </Reveal>

      <div className="mx-auto mt-14 max-w-3xl">
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No public release notes yet — check back soon.
          </p>
        ) : (
          <ol className="relative space-y-10 border-l border-border pl-8">
            {entries.map((e: any) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[37px] mt-1 flex size-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">v{e.version}</Badge>
                  {e.product && (
                    <Link
                      href={`/products/${e.product.slug}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {e.product.name}
                    </Link>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDate(e.releasedAt)}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{e.title}</h3>
                <div className="mt-2 text-sm text-muted-foreground">
                  <Markdown content={e.body} className="prose-sm" />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Section>
  );
}
