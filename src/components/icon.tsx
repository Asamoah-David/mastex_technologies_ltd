import { icons, type LucideProps } from "lucide-react";

/** Resolve a Lucide icon by its string name (as stored in the DB). */
export function Icon({ name, ...props }: { name?: string | null } & LucideProps) {
  const Cmp = (name && (icons as Record<string, any>)[name]) || icons.Box;
  return <Cmp {...props} />;
}
