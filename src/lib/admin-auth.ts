import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { Role, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const COOKIE = "mastex_admin_session";
const SECRET = process.env.AUTH_SECRET ?? "dev-secret";

export type AdminSession = Pick<User, "id" | "email" | "name" | "role"> & {
  via: "supabase" | "dev";
};

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

function makeToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, t: Date.now() })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string): { email: string } | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return { email: data.email };
  } catch {
    return null;
  }
}

/** Resolve the current admin user from Supabase first, then the dev cookie. */
export async function getAdminSession(): Promise<AdminSession | null> {
  // 1) Real Supabase-backed session.
  const supaUser = await getCurrentUser();
  if (supaUser) {
    return { ...supaUser, via: "supabase" };
  }

  // 2) Dev cookie session (local mode without Supabase).
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const verified = verifyToken(token);
  if (!verified) return null;

  const dbUser = await prisma.user
    .findUnique({ where: { email: verified.email } })
    .catch(() => null);

  if (dbUser) return { ...dbUser, via: "dev" };

  // Fallback synthetic super admin if the DB is unavailable but creds matched.
  if (verified.email === (process.env.SEED_SUPERADMIN_EMAIL ?? "admin@mastex.tech")) {
    return {
      id: "dev-superadmin",
      email: verified.email,
      name: "Super Admin",
      role: "SUPER_ADMIN" as Role,
      via: "dev",
    };
  }
  return null;
}

/** Validate dev credentials against env, returning a session cookie value. */
export function devAuthenticate(email: string, password: string): string | null {
  const okEmail = process.env.SEED_SUPERADMIN_EMAIL ?? "admin@mastex.tech";
  const okPass = process.env.SEED_SUPERADMIN_PASSWORD ?? "ChangeMe!2026";
  if (email.trim().toLowerCase() === okEmail.toLowerCase() && password === okPass) {
    return makeToken(okEmail);
  }
  return null;
}

export const ADMIN_COOKIE = COOKIE;
