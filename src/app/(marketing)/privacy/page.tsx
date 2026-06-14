import { Markdown } from "@/components/markdown";
import { Section } from "@/components/site/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Mastex Technologies Ltd collects, uses and protects your data.",
  path: "/privacy",
});

const CONTENT = `# Privacy Policy

_Last updated: 2026_

Mastex Technologies Ltd ("Mastex", "we", "us") respects your privacy. This policy explains what
we collect, how we use it, and your rights.

## Information we collect
- **Contact details** you provide via our forms (name, email, company, message).
- **Usage data** — first-party, cookie-less analytics (pages visited, anonymous session id). We do
  not use third-party advertising trackers.
- **Account data** for customers of our products, governed by the relevant product agreement.

## How we use information
- To respond to enquiries and provide our products and services.
- To improve our website and products.
- To send updates you've requested. You can opt out at any time.

## Data protection
We apply role-based access control, audit logging, encryption in transit, and security headers.
We never sell your personal data.

## Your rights
You may request access to, correction of, or deletion of your personal data by emailing
**privacy@mastex.tech**.

## Contact
Questions? Email **privacy@mastex.tech**.
`;

export default function PrivacyPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <Markdown content={CONTENT} />
      </div>
    </Section>
  );
}
