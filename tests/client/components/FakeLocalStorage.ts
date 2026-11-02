// A fake version of global.localStorage that also registers as
// the global instance. Used for testing.
export class FakeLocalStorage implements Storage {
  private saved: Storage | undefined;
  private data: {[x: string]: string} = {};

  private static assign(value: any) {
    Object.defineProperty(global, 'localStorage', {value: value, configurable: true, writable: true});
  }
  public static register(localStorage: FakeLocalStorage): void {
    localStorage.saved = (global as any).localStorage;
    this.assign(localStorage);
  }

  public static deregister(localStorage: FakeLocalStorage) {
    this.assign(localStorage.saved);
  }

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
