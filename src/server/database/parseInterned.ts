/**
 * A `JSON.parse` that de-duplicates repeated string *values* so that equal
 * strings share a single object.
 *
 * V8 interns source-code literals and object keys, but not `JSON.parse` string
 * values — so a reloaded game's state and log otherwise hold thousands of
 * duplicate strings (e.g. `"red"`, `"${0} played ${1}"`), which measured ~8% of a
 * resident game's memory. The reviver returns a pooled reference for each string
 * value (non-strings pass through unchanged); because a reviver's return value
 * replaces the parsed value, all equal strings collapse onto one object.
 *
 * `pool` defaults to a fresh `Map` per call. Pass a shared pool to dedupe across
 * several parses of the same game (its game / log / options). Keep pools
 * per-game and short-lived: a long-lived global pool would pin every distinct
 * string in memory forever.
 */
export function parseInterned<T = unknown>(text: string, pool: Map<string, string> = new Map()): T {
  return JSON.parse(text, (_key, value: unknown) => {
    if (typeof value !== 'string') {
      return value;
    }
    const existing = pool.get(value);
    if (existing !== undefined) {
      return existing;
    }
    pool.set(value, value);
    return value;
  }) as T;
}
