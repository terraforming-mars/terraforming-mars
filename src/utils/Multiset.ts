export class Multiset<T> {
    private map: Map<T, number> = new Map();

    constructor(items: Array<T> = []) {
        items.forEach((item: T) => this.add(item));
    }

    add(key: T, count: number = 1): number {
        const val = (this.get(key) || 0) + count;
        this.map.set(key, val);
        return val;
    }

    remove(key: T, count: number = 1): void {
        let val = this.get(key);
        if (val === undefined) return;

        val -= count;
        if (val <= 0) {
            this.map.delete(key);
        } else {
            this.map.set(key, val);
        }
    }

    get(key: T): number | undefined {
        return this.map.get(key);
    }

    entries(): Array<[T, number]> {
        return Array.from(this.map);
    }

    toString(): string {
        return this.map.toString();
    }
}
