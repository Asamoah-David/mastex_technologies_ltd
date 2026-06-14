"use client";

import * as React from "react";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brand } from "@/components/brand";
import { loginAction } from "../actions";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(loginAction, { error: undefined } as {
    error?: string;
  });

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Image panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/hero-team.jpg"
          alt="Mastex team"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#060a14]/80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1838]/80 via-transparent to-[#1d4ed8]/30" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Brand href={null} className="[&_span]:text-white" />
          <div>
            <p className="text-2xl font-semibold leading-snug text-balance">
              The control center for everything Mastex builds.
            </p>
            <p className="mt-3 text-white/70">
              Manage products, content, leads and analytics — all from one secure dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-4 text-center lg:hidden">
            <Brand href={null} />
          </div>
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" /> Admin access
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to your dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Enter your credentials to continue.
          </p>

          <form action={formAction} className="mt-8 space-y-4">
            <input type="hidden" name="next" value={next} />
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="admin@mastex.tech" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>

            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Sign in
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Protected area. Unauthorised access is prohibited.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
