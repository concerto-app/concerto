import * as ScreenOrientation from "expo-screen-orientation";

export const Orientation = ScreenOrientation.OrientationLock;

export async function changeScreenOrientation(
  lock: ScreenOrientation.OrientationLock
) {
  await ScreenOrientation.lockAsync(lock);
}

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
