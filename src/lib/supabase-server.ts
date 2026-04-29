import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env vars (SUPABASE_URL, SUPABASE_KEY) are required"
    );
  }
  client = createClient(url, key);
  return client;
}
