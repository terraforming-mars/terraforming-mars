export interface ISerializable<T, T2> {
  loadFromJSON(d: T): T2;
  serialize(): T;
}
