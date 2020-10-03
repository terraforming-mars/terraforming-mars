export class Multiset<T> {
    private map: Map<T, number> = new Map();

    constructor(items: Array<T> = []) {
        items.forEach((item: T) => this.add(item));
    }
    add(key: T, count: number = 1) : number {
        var val = (this.get(key) || 0) + count;
        this.map.set(key, val);
        return val;
    }

    get(key: T): number | undefined {
        return this.map.get(key);
    }

    entries(): Array<[T, number]> {
        var results: Array<[T, number]> = [];
        this.map.forEach((count: number, key: T) => {
            results.push([key, count]);
        });
        return results;
    }

    toString(): string {
        return this.map.toString();
    }
}