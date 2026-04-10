export type Lazy<T> = () => T;

export function once<T>(provider: Lazy<T>): Lazy<T> {
  let evaluated = false;
  let result: T;

  return () => {
    if (!evaluated) {
      result = provider();
      evaluated = true;
    }
    return result;
  };
}
