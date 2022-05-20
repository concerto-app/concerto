import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  main: MainParams;
  play: PlayParams;
  settings: SettingsParams;
};

export type MainParams = {
  availableEmojiCodes: Array<string>;
  codeLength?: number;
};

export type PlayParams = {};
export type SettingsParams = {};

export type MainProps = NativeStackScreenProps<RootStackParamList, "main">;
export type PlayProps = NativeStackScreenProps<RootStackParamList, "play">;
export type SettingsProps = NativeStackScreenProps<
  RootStackParamList,
  "settings"
>;
