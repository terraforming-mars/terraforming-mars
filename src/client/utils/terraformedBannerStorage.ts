// Tracks, per game (keyed on the viewer's player id), whether the
// "Mars is Terraformed!" banner's entrance animation has already played, so a
// page refresh doesn't replay it.
//
// Stored in localStorage. Each entry's value is an expiry timestamp; expired or
// malformed entries are swept once when this module is first loaded, so flags
// from finished games don't accumulate. Mirrors the approach in fontSizeCache.
import {PlayerId} from '@/common/Types';

const STORAGE_PREFIX = 'terraformedBannerShown:';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function localStorageSupported(): boolean {
  return typeof localStorage !== 'undefined';
}

// Remove expired or malformed entries once, when this module is first loaded.
if (localStorageSupported()) {
  const now = Date.now();
  const stale: Array<string> = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k !== null && k.startsWith(STORAGE_PREFIX)) {
      const expireMs = Number(localStorage.getItem(k));
      if (!Number.isFinite(expireMs) || expireMs <= now) {
        stale.push(k);
      }
    }
  }
  for (const k of stale) {
    localStorage.removeItem(k);
  }
}

// Returns true the first time the banner is shown for a game, recording the flag
// (with an expiry) so subsequent page loads return false. Returns true when
// storage is unavailable, so the animation still plays.
export function consumeFirstBannerShow(playerId: PlayerId): boolean {
  try {
    if (!localStorageSupported()) {
      return true;
    }
    const key = `${STORAGE_PREFIX}${playerId}`;
    if (localStorage.getItem(key) !== null) {
      return false;
    }
    localStorage.setItem(key, String(Date.now() + TTL_MS));
    return true;
  } catch (err) {
    console.warn('unable to access terraformed banner flag in local storage', err);
    return false;
  }
}
