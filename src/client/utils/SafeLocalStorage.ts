// The single point of contact with the browser's localStorage. Every read or
// write goes through here so that the typeof guard (localStorage may not exist,
// e.g. during SSR or in some privacy modes) and error handling (access can throw
// when storage is disabled or over quota) live in exactly one place.
//
// All methods fail soft: reads return null/[] and writes are dropped rather than
// throwing, so callers never need their own try/catch.

function supported(): boolean {
  return typeof localStorage !== 'undefined';
}

export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (!supported()) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn('unable to read from local storage', err);
      return null;
    }
  },

  setItem(key: string, value: string): void {
    if (!supported()) {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn('unable to write to local storage', err);
    }
  },

  removeItem(key: string): void {
    if (!supported()) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn('unable to remove from local storage', err);
    }
  },

  // A snapshot of all keys currently in storage. Returns [] when storage is
  // unavailable or enumeration throws, so callers can iterate unconditionally.
  keys(): Array<string> {
    if (!supported()) {
      return [];
    }
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
