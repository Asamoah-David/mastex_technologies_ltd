"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { setBrandLogo } from "./actions";

export function BrandLogoEditor({ current }: { current: string }) {
  const [url, setUrl] = React.useState(current);
  const [pending, start] = React.useTransition();
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function save() {
    start(async () => {
      setError(null);
      const res = await setBrandLogo(url.trim());
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Brand logo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload your logo mark (square works best — it appears in the header, footer and admin).
          Leave empty to use the bundled default.
        </p>
        <div className="max-w-md">
          <ImageUploadField value={url} onChange={setUrl} placeholder="/logo-mark.png or https://" />
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={save} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />} Save logo
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-sm text-primary">
              <Check className="size-4" /> Saved — refresh to see it everywhere
            </span>
          )}
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
