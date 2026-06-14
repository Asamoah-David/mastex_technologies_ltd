import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Brand } from "@/components/brand";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { footerNav, siteConfig } from "@/config/site";

export function Footer({
  extraLinks = [],
  logoSrc,
}: {
  extraLinks?: { label: string; href: string; isExternal?: boolean }[];
  logoSrc?: string;
}) {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-border/60 py-10 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-semibold">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground">
              Product updates and engineering notes. No spam.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
      <div className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-4">
            <Brand markSrc={logoSrc} />
            <p className="max-w-xs text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="flex gap-2">
              <SocialLink href={siteConfig.socials.x} label="X">
                <Twitter className="size-4" />
              </SocialLink>
              <SocialLink href={siteConfig.socials.linkedin} label="LinkedIn">
                <Linkedin className="size-4" />
              </SocialLink>
              <SocialLink href={siteConfig.socials.github} label="GitHub">
                <Github className="size-4" />
              </SocialLink>
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {extraLinks.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/60 pt-6">
            {extraLinks.map((link) =>
              link.isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built in Accra, Ghana 🇬🇭</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </a>
  );
}
