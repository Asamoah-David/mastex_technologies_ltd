import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for privileged server operations (storage
 * uploads, admin tasks). NEVER import this into client components.
 *
 * Returns null in local/mock mode (no real Supabase configured) so callers can
 * degrade gracefully.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || url.includes("placeholder") || !key || key.includes("placeholder")) {
    return null;
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function isStorageConfigured(): boolean {
  return createAdminClient() !== null;
}

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
