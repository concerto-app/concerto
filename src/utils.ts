import * as ScreenOrientation from "expo-screen-orientation";

export const Orientation = ScreenOrientation.OrientationLock;

export async function changeScreenOrientation(
  lock: ScreenOrientation.OrientationLock
) {
  await ScreenOrientation.lockAsync(lock);
}
