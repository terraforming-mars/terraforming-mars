// Tracks, per game (keyed on the viewer's player id), whether the
// "Mars is Terraformed!" banner's entrance animation has already played, so a
// page refresh doesn't replay it. Entries expire (and are swept) so flags from
// finished games don't accumulate.
import {PlayerId} from '@/common/Types';
import {LocalStorageStore} from '@/client/utils/LocalStorageStore';

const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const store = new LocalStorageStore<true>({prefix: 'terraformedBannerShown:', ttlMs: TTL_MS});

// Returns true the first time the banner is shown for a game, recording the flag
// so subsequent page loads return false.
export function consumeFirstBannerShow(playerId: PlayerId): boolean {
  if (store.get(playerId) !== undefined) {
    return false;
  }
  store.set(playerId, true);
  return true;
}
