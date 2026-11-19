// A fake version of global.localStorage. Used for testing.
// Install it with useFakeLocalStorage().
export class FakeLocalStorage implements Storage {
  private data: {[x: string]: string} = {};

  public getItem(key: string) {
    if (this.data[key] === undefined) {
      return null;
    }
    return this.data[key];
  }

  public setItem(key: string, value: string) {
    this.data[key] = value;
  }

  public clear(): void {
    this.data = {};
  }

  public get length(): number {
    return Object.keys(this.data).length;
  }

  key(index: number): string | null {
    return Object.keys(this.data)[index] ?? null;
  }

  public removeItem(key: string): void {
    delete this.data[key];
  }

  public hasItem(key: string): boolean {
    return typeof this.data[key] !== 'undefined';
  }
}

function assignGlobal(value: Storage | undefined) {
  Object.defineProperty(global, 'localStorage', {value: value, configurable: true, writable: true});
}

// Installs a fresh FakeLocalStorage as global.localStorage before each test
// and restores the original after. Call inside a describe block. The returned
// function gives access to the current test's instance.
export function useFakeLocalStorage(): () => FakeLocalStorage {
  let localStorage: FakeLocalStorage;
  let saved: Storage | undefined;
  beforeEach(() => {
    saved = global.localStorage;
    localStorage = new FakeLocalStorage();
    assignGlobal(localStorage);
  });
  afterEach(() => {
    assignGlobal(saved);
  });
  return () => localStorage;
}
