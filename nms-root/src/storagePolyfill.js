/**
 * window.storage polyfill — Supabase REST backend
 *
 * Implements the same API that MarketingStudio uses (Claude artifact storage):
 *   window.storage.get(key, shared?)    → { key, value, shared } | null
 *   window.storage.set(key, value, shared?) → { key, value, shared } | null
 *   window.storage.delete(key, shared?) → { key, deleted, shared } | null
 *   window.storage.list(prefix?, shared?) → { keys, shared } | null
 *
 * Uses the existing kv_store table (same one as nassa-portal).
 * The `shared` param is accepted but stored with a "shared:" key prefix
 * so it works without adding a column to the table.
 */

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SB_URL || !SB_KEY) {
  console.error(
    "[NMS] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — data will not persist."
  );
}

const SB_HEADERS = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  "Content-Type": "application/json",
};

/** Resolve the actual DB key, using a prefix for shared entries */
function dbKey(key, shared) {
  return shared ? `shared:${key}` : key;
}

export const storage = {
  async get(key, shared = false) {
    try {
      const k = dbKey(key, shared);
      const res = await fetch(
        `${SB_URL}/rest/v1/kv_store?key=eq.${encodeURIComponent(k)}&select=value`,
        { headers: SB_HEADERS }
      );
      const data = await res.json();
      if (!data.length) return null;
      return { key, value: data[0].value, shared };
    } catch {
      return null;
    }
  },

  async set(key, value, shared = false) {
    try {
      const k = dbKey(key, shared);
      const res = await fetch(`${SB_URL}/rest/v1/kv_store`, {
        method: "POST",
        headers: { ...SB_HEADERS, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ key: k, value }),
      });
      if (!res.ok) return null;
      return { key, value, shared };
    } catch {
      return null;
    }
  },

  async delete(key, shared = false) {
    try {
      const k = dbKey(key, shared);
      await fetch(
        `${SB_URL}/rest/v1/kv_store?key=eq.${encodeURIComponent(k)}`,
        { method: "DELETE", headers: SB_HEADERS }
      );
      return { key, deleted: true, shared };
    } catch {
      return null;
    }
  },

  async list(prefix = "", shared = false) {
    try {
      const p = shared ? `shared:${prefix}` : prefix;
      // PostgREST LIKE: % must be encoded as %25 when inside the query string value
      const pattern = encodeURIComponent(p + "%");
      const res = await fetch(
        `${SB_URL}/rest/v1/kv_store?select=key&key=like.${pattern}`,
        { headers: SB_HEADERS }
      );
      const data = await res.json();
      if (!Array.isArray(data)) return null;
      // Strip the "shared:" prefix back off before returning
      const keys = data.map((r) =>
        shared ? r.key.replace(/^shared:/, "") : r.key
      );
      return { keys, ...(prefix ? { prefix } : {}), shared };
    } catch {
      return null;
    }
  },
};

/** Call once before <MarketingStudio> mounts */
export function installStoragePolyfill() {
  if (typeof window !== "undefined") {
    window.storage = storage;
  }
}
