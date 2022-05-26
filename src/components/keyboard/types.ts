import ReactNative from "react-native";

export type KeyboardLayoutProps = {
  octavesNumber?: number;
  keyWidth?: number;
  keyHeight?: number;
  keyDepth?: number;
  spacing?: number;
};

export type KeyboardProps = ReactNative.ViewProps &
  KeyboardLayoutProps & {
    borderColor?: string;
    onKeyPressedIn?: (note: number) => void;
    onKeyPressedOut?: (note: number) => void;
  };
