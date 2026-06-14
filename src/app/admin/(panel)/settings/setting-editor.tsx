"use client";

import * as React from "react";
import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSetting } from "./actions";

export function SettingEditor({ setting }: { setting: { key: string; value: any } }) {
  const [state, action, pending] = useActionState(updateSetting, {} as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono text-sm">{setting.key}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-3">
          <input type="hidden" name="key" value={setting.key} />
          <Textarea
            name="value"
            rows={Math.min(16, JSON.stringify(setting.value, null, 2).split("\n").length + 1)}
            defaultValue={JSON.stringify(setting.value, null, 2)}
            className="font-mono text-xs"
          />
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Save
            </Button>
            {state?.ok && (
              <span className="inline-flex items-center gap-1 text-sm text-primary">
                <Check className="size-4" /> Saved
              </span>
            )}
            {state?.error && <span className="text-sm text-destructive">{state.error}</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
