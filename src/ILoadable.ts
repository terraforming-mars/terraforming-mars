export interface ILoadable<T, T2> {
    loadFromJSON(d: T): T2;
}
