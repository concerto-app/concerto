import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  main: MainParams;
  play: PlayParams;
  settings: SettingsParams;
};

export type MainParams = {
  availableEmojiCodes: Array<EmojiId>;
  codeLength?: number;
};

export type PlayParams = {
  code: Code;
};

export type SettingsParams = {
  code: Code;
  users: Array<[UserId, EmojiId]>;
};

export type MainProps = NativeStackScreenProps<RootStackParamList, "main">;
export type PlayProps = NativeStackScreenProps<RootStackParamList, "play">;
export type SettingsProps = NativeStackScreenProps<
  RootStackParamList,
  "settings"
>;
