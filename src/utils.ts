export function objectMap<A, B>(
  obj: { [s: string]: A },
  fn: (v: A, k: string, i: number) => B
) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
  );
}

export function mapMap<K, VA, VB>(
  m: Map<K, VA>,
  fn: (v: VA, k: K, i: number) => VB
) {
  return new Map(
    Array.from(m, ([key, value], index) => [key, fn(value, key, index)])
  );
}
