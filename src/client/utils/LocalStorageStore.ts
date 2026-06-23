// A namespaced, typed view over localStorage built on safeLocalStorage.
//
// Each store owns a key prefix and (de)serializes values as JSON. With a ttlMs,
// entries carry an expiry, expired reads return undefined, and the store sweeps
// its own expired/malformed entries once when it is created. With cached: true,
// all live entries are mirrored in an in-memory Map so hot read paths don't hit
// localStorage on every access (used by the font-size cache, which reads ~1000
// entries per page render).
//
// A store may also supply migrate(): when an entry isn't in the current envelope
// format (e.g. data written before this layer existed), migrate is given the raw
// string and may recover a value. Recovered entries are rewritten in the current
// format (with a fresh ttl) rather than dropped.
import {safeLocalStorage} from '@/client/utils/SafeLocalStorage';

// The on-disk shape of every entry: the value (v) plus an optional expiry
// timestamp (e, epoch ms), present only when the store has a ttl. Wrapping the
// value lets us attach the expiry and recognise our own entries vs. foreign or
// legacy data (see isEnvelope / migrate).
type Envelope<T> = {v: T, e?: number};

export type LocalStorageStoreOptions<T> = {
  // Namespace for this store's keys; every id is stored as prefix + id.
  prefix: string;
  // If set, entries expire this many ms after they are written and are swept on
  // creation. Omit for entries that should persist indefinitely.
  ttlMs?: number;
  // Keep an in-memory Map mirror so reads don't hit localStorage each time.
  // For hot read paths (e.g. the font-size cache reads ~1000 entries per render).
  cached?: boolean;
  // Recover a value from a raw string that isn't in the current envelope format
  // (e.g. data written before this layer existed). Returning a value rewrites it
  // forward; returning undefined lets the entry be dropped.
  // TODO(2026-09-01): remove migrate, and the rewrite-forward handling it drives,
  // once all pre-envelope data has aged out. CardOrderStorage is the only store
  // that uses it; see the matching TODO there.
  migrate?: (raw: string) => T | undefined;
}

// True when value is one of our envelopes (an object carrying a `v` field),
// distinguishing our entries from foreign or pre-envelope data.
function isEnvelope(value: unknown): value is Envelope<unknown> {
  return typeof value === 'object' && value !== null && 'v' in value;
}

// A namespaced, typed store over localStorage. Ids are the caller-facing keys;
// the prefix is applied internally, so callers never see it.
export class LocalStorageStore<T> {
  private readonly prefix: string;
  private readonly ttlMs?: number;
  private readonly migrate?: (raw: string) => T | undefined;
  // The in-memory mirror, present when cached. A present key maps to its live
  // value; absent means not stored.
  private readonly mirror?: Map<string, T>;

  constructor(options: LocalStorageStoreOptions<T>) {
    this.prefix = options.prefix;
    this.ttlMs = options.ttlMs;
    this.migrate = options.migrate;
    this.mirror = options.cached ? new Map<string, T>() : undefined;

    // One-time sweep / mirror load. Only needed when we expire entries, migrate
    // them, or mirror them; a plain store reads through on demand.
    if (this.ttlMs !== undefined || this.mirror !== undefined || this.migrate !== undefined) {
      const now = Date.now();
      for (const key of safeLocalStorage.keys()) {
        if (!key.startsWith(this.prefix)) {
          continue;
        }
        const raw = safeLocalStorage.getItem(key);
        if (raw === null) {
          continue;
        }
        const loaded = this.interpret(raw, now);
        if (loaded === undefined) {
          safeLocalStorage.removeItem(key); // expired or unrecoverable
        } else {
          if (loaded.rewrite) {
            safeLocalStorage.setItem(key, this.envelope(loaded.value)); // migrate forward
          }
          this.mirror?.set(key.substring(this.prefix.length), loaded.value);
        }
      }
    }
  }

  // The stored value for id, or undefined if absent, expired, or unrecoverable.
  get(id: string): T | undefined {
    if (this.mirror !== undefined) {
      return this.mirror.get(id);
    }
    const raw = safeLocalStorage.getItem(this.prefix + id);
    if (raw === null) {
      return undefined;
    }
    return this.interpret(raw, Date.now())?.value;
  }

  // Stores value under id (refreshing the expiry, if the store has a ttl).
  set(id: string, value: T): void {
    this.mirror?.set(id, value);
    safeLocalStorage.setItem(this.prefix + id, this.envelope(value));
  }

  // Deletes id from the store.
  remove(id: string): void {
    this.mirror?.delete(id);
    safeLocalStorage.removeItem(this.prefix + id);
  }

  private envelope(value: T): string {
    const e: Envelope<T> = this.ttlMs === undefined ? {v: value} : {v: value, e: Date.now() + this.ttlMs};
    return JSON.stringify(e);
  }

  // Interpret a stored raw string. Returns the value and whether it should be
  // rewritten in the current format (a recovered legacy value), or undefined if
  // the entry should be dropped (expired or unrecoverable).
  private interpret(raw: string, now: number): {value: T, rewrite: boolean} | undefined {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = undefined;
    }
    if (isEnvelope(parsed)) {
      const env = parsed as Envelope<T>;
      if (env.e !== undefined && env.e <= now) {
        return undefined; // expired
      }
      return {value: env.v, rewrite: false};
    }
    // Not our envelope: offer it to migrate before giving up.
    if (this.migrate !== undefined) {
      const value = this.migrate(raw);
      if (value !== undefined) {
        return {value, rewrite: true};
      }
    }
    return undefined;
  }
}
