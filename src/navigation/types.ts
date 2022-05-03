import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  main: MainParams;
  play: PlayParams;
};

export type MainParams = {
  emojiCodes: Array<string>;
  codeLength?: number;
};

export type PlayParams = {
  code: Array<string>;
};

export type MainProps = NativeStackScreenProps<RootStackParamList, "main">;
export type PlayProps = NativeStackScreenProps<RootStackParamList, "play">;
