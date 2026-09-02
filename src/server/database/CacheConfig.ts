export type CacheConfig = {
  sweep: 'auto' | 'manual',
  evictMillis: number,
  sleepMillis: number,
  // Evict games idle (untouched) for longer than this. <= 0 disables idle eviction.
  idleMillis: number,
}
