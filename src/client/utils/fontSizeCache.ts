// Persistent cache of fitted font sizes (see textFit), keyed on the rendered
// (translated) text, which keeps it locale-correct automatically.
//
// Stored in localStorage rather than a cookie so it isn't sent to the server on
// every request. Each entry is namespaced by a prefix. Entries expire two days
// after they were written; the expiry is set when an entry is written and is not
// extended on read.
const CACHE_PREFIX = 'fontSize:';
const CACHE_TTL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

type CacheEntry = {size: number, expireMs: number};

function localStorageSupported(): boolean {
  return typeof localStorage !== 'undefined';
}

// In-memory mirror of the localStorage entries, loaded once (dropping expired
// ones). Fitting a full page of text would otherwise make a synchronous
// localStorage read per element, which is slow at ~1000 elements.
const entries = new Map<string, number>();
if (localStorageSupported()) {
  const now = Date.now();
  const keys: Array<string> = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k !== null && k.startsWith(CACHE_PREFIX)) {
      keys.push(k);
    }
  }
  for (const k of keys) {
    const raw = localStorage.getItem(k);
    if (raw === null) {
      continue;
    }
    try {
      const entry: CacheEntry = JSON.parse(raw);
      if (Number.isFinite(entry.size) && entry.expireMs > now) {
        entries.set(k.substring(CACHE_PREFIX.length), entry.size);
      } else {
        // Expired or malformed.
        localStorage.removeItem(k);
      }
    } catch {
      localStorage.removeItem(k);
    }
  }
}

export function getCachedFontSize(key: string): number | undefined {
  return entries.get(key);
}

export function setCachedFontSize(key: string, size: number): void {
  entries.set(key, size);
  if (localStorageSupported()) {
    const entry: CacheEntry = {size, expireMs: Date.now() + CACHE_TTL_MS};
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  }
}
