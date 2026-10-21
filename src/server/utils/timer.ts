export function timeSync<T>(cb: () => T): {value: T, duration: number} {
  const startMs = Date.now();
  return {
    value: cb(),
    duration: Date.now() - startMs,
  };
}

export async function timeAsync<T>(promise: Promise<T>): Promise<{value: T, duration: number}> {
  const startMs = Date.now();
  const value = await promise;
  return {value, duration: Date.now() - startMs};
}
