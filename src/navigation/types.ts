import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  main: MainParams;
  play: PlayParams;
  settings: SettingsParams;
  error: ErrorParams;
};

export type MainParams = {};
export type PlayParams = {};
export type SettingsParams = {};
export type ErrorParams = { message?: string };

export type MainProps = NativeStackScreenProps<RootStackParamList, "main">;
export type PlayProps = NativeStackScreenProps<RootStackParamList, "play">;
export type SettingsProps = NativeStackScreenProps<
  RootStackParamList,
  "settings"
>;
export type ErrorProps = NativeStackScreenProps<RootStackParamList, "error">;
