export interface ILoadable<T> {
    loadFromJSON(d: T): T;
}