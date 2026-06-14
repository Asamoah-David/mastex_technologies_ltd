import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Brand />
      <div>
        <p className="text-7xl font-bold tracking-tight text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
