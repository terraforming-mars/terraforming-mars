/**
 * A smaller, fail-soft interface to the browser's `localStorage`.
 *
 * When storage is missing, disabled, or full, reads return null or [] and writes are dropped, so
 * callers don't need their own try/catch.
 */
export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn('unable to read from local storage', err);
      return null;
    }
  },

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn('unable to write to local storage', err);
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn('unable to remove from local storage', err);
    }
  },

  /**
   * A snapshot of all keys currently in storage.
   *
   * Returns [] when storage is unavailable or enumeration throws, so callers can iterate
   * unconditionally.
   */
  keys(): Array<string> {
    try {
      const result: Array<string> = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k !== null) {
          result.push(k);
        }
      }
      return result;
    } catch (err) {
      console.warn('unable to enumerate local storage', err);
      return [];
    }
  },
};
