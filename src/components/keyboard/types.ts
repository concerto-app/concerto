import { PressedInfo } from "./Key";
import ReactNative from "react-native";

export type PressedKeys = Map<string, PressedInfo>;

export type KeyboardLayoutProps = {
  octavesNumber?: number;
  keyWidth?: number;
  keyHeight?: number;
  keyDepth?: number;
  spacing?: number;
};

export type KeyboardProps = ReactNative.ViewProps &
  KeyboardLayoutProps & {
    pressedKeys: PressedKeys;
    borderColor?: string;
    onKeyPressedIn?: (note: string, octave: number) => void;
    onKeyPressedOut?: (note: string, octave: number) => void;
  };
