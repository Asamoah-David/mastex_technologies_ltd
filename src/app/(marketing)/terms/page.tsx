import { Markdown } from "@/components/markdown";
import { Section } from "@/components/site/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms governing use of Mastex Technologies Ltd's website and products.",
  path: "/terms",
});

const CONTENT = `# Terms of Service

_Last updated: 2026_

These terms govern your use of the Mastex Technologies Ltd website and products. By using our
services, you agree to these terms.

## Use of our services
You agree to use our services lawfully and not to misuse, disrupt, or attempt to gain
unauthorised access to any system.

## Accounts
You are responsible for safeguarding your account credentials and for all activity under your
account.

## Intellectual property
All content, trademarks and software on this site are owned by Mastex Technologies Ltd or its
licensors and are protected by applicable laws.

## Product agreements
Use of individual products may be subject to additional, product-specific terms provided at
sign-up.

## Disclaimer & liability
Our services are provided "as is". To the maximum extent permitted by law, Mastex is not liable
for indirect or consequential damages.

## Changes
We may update these terms from time to time. Continued use after changes constitutes acceptance.

## Contact
Questions about these terms? Email **legal@mastex.tech**.
`;

export default function TermsPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <Markdown content={CONTENT} />
      </div>
    </Section>
  );
}
