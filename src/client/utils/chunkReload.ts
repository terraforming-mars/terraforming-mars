// Recovery for a webpack chunk that fails to load because the page is running
// a `main.js` and a `vendors.js` from two different builds.
//
// The files carry no content hash, so after a redeploy a browser can pair a
// cached runtime with a freshly fetched vendors bundle. The runtime then asks
// for a chunk id the new build no longer serves, the dynamic `import()`
// rejects, and the lazy-loaded screen renders nothing. A single reload fetches
// a matching set of files and recovers.

const RELOAD_MARKER = 'chunkReloadAt';
const RELOAD_COOLDOWN_MS = 15_000;

/** Whether `reason` is a failed dynamic-import (chunk load) error. */
export function isChunkLoadError(reason: unknown): boolean {
  if (reason === undefined || reason === null) {
    return false;
  }
  const error = reason as {name?: string, message?: string};
  if (error.name === 'ChunkLoadError') {
    return true;
  }
  const message = typeof error.message === 'string' ? error.message : '';
  return /Loading (CSS )?chunk .+ failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message);
}

/**
 * Whether to reload now for a chunk load error.
 *
 * Returns false unless `reason` is a chunk load error and the last reload this
 * tab attempted for one was more than the cooldown ago, so a chunk that stays
 * missing surfaces as an error rather than an endless reload loop.
 */
export function shouldReloadForChunkError(reason: unknown, now: number, lastReloadAt: number): boolean {
  if (!isChunkLoadError(reason)) {
    return false;
  }
  return now - lastReloadAt >= RELOAD_COOLDOWN_MS;
}

/** Reloads the page once when a lazy chunk fails to load, guarded against loops. */
export function installChunkReloadHandler(): void {
  window.addEventListener('unhandledrejection', (event) => {
    let lastReloadAt = 0;
    try {
      lastReloadAt = Number(window.sessionStorage.getItem(RELOAD_MARKER) ?? '0');
    } catch (_e) {
      // sessionStorage can throw in private mode; treat it as never reloaded.
    }
    if (!shouldReloadForChunkError(event.reason, Date.now(), lastReloadAt)) {
      return;
    }
    try {
      window.sessionStorage.setItem(RELOAD_MARKER, String(Date.now()));
    } catch (_e) {
      // Ignore: the reload still helps, it just is not loop-guarded.
    }
    window.location.reload();
  });
}
