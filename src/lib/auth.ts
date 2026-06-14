import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@prisma/client";

/**
 * Resolve the current authenticated user by joining the Supabase Auth session
 * to our application `User` row. Cached per request.
 *
 * In local/mock mode (no Supabase configured) this returns null, and the admin
 * area falls back to the dev login flow.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;

    return await prisma.user.findUnique({ where: { email: user.email } });
  } catch {
    return null;
  }
});

export async function requireUser(): Promise<User | null> {
  return getCurrentUser();
}
