// Persistent cache of fitted font sizes (see textFit), keyed on the rendered
// (translated) text, which keeps it locale-correct automatically.
//
// Stored in localStorage rather than a cookie so it isn't sent to the server on
// every request. Entries expire two days after they were written; the expiry is
// set when an entry is written and is not extended on read. The store is cached
// in memory so fitting a full page (~1000 elements) doesn't make a synchronous
// localStorage read per element.
import {LocalStorageStore} from '@/client/utils/LocalStorageStore';

const CACHE_TTL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

const store = new LocalStorageStore<number>({prefix: 'fontSize:', ttlMs: CACHE_TTL_MS, cached: true});

export function getCachedFontSize(key: string): number | undefined {
  return store.get(key);
}

export function setCachedFontSize(key: string, size: number): void {
  store.set(key, size);
}
