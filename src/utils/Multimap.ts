export class Multimap<K, V> {
    private map: Map<K, Set<V>> = new Map();

    put(key: K, val: V): void {
      const set: Set<V> = this.get(key) || new Set<V>();
      set.add(val);
      this.map.set(key, set);
    }

    putAll(key: K, vals: Array<V>): void {
      const set: Set<V> = this.get(key) || new Set<V>();
      vals.forEach((v) => set.add(v));
      this.map.set(key, set);
    }

    delete(key: K, val: V): void {
      this.get(key)?.delete(val);
    }

    removeAll(key: K): void {
      this.map.delete(key);
    }

    get(key: K): Set<V> | undefined {
      return this.map.get(key);
    }

    entries(): Array<[K, V]> {
      return []; // TODO
    }

    toString(): string {
      return this.map.toString();
    }
}
