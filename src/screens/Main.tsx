import tw from "../tailwind";
import ReactNative from "react-native";
import Heading from "../components/Heading";
import RegularText from "../components/RegularText";
import EmojiCode from "../components/EmojiCode";
import { useEffect, useState } from "react";
import EmojiGrid from "../components/EmojiGrid";
import { MainProps } from "../navigation/types";
import { changeScreenOrientation, Orientation } from "../utils";

export default function Main({ route, navigation }: MainProps) {
  const { emojiCodes, codeLength = 3 } = route.params;

  const [code, setCode] = useState<Array<string>>([]);

  const toInternalCode: (
    current: Array<string>,
    length: number
  ) => Array<string | null> = (current: Array<string>, length: number) => {
    return [
      ...current,
      ...Array(Math.max(0, length - current.length)).fill(null),
    ];
  };

  const onEmojiSelected: (emojiCode: string) => void = (emojiCode: string) => {
    if (code.length < codeLength) setCode([...code, emojiCode]);
  };

  useEffect(() => {
    if (code.length < codeLength) return;
    setCode([]);
    navigation.navigate("play", { code: code });
  }, [code]);

  useEffect(() => {
    changeScreenOrientation(Orientation.DEFAULT).then().catch(console.log);
  });

  return (
    <ReactNative.View style={tw.style("flex-1", "bg-white")}>
      <ReactNative.View
        style={tw.style("flex-1", "items-center", "justify-center")}
      >
        <Heading>concerto</Heading>
        <RegularText>Enter PIN to join a room</RegularText>
      </ReactNative.View>
      <ReactNative.View
        style={tw.style("flex-1", "items-center", "justify-center")}
      >
        <EmojiCode codes={toInternalCode(code, codeLength)} />
      </ReactNative.View>
      <ReactNative.View
        style={tw.style("flex-1", "items-center", "justify-center")}
      >
        <EmojiGrid
          emojiCodes={emojiCodes}
          onEmojiSelected={onEmojiSelected}
          style={tw.style("my-4")}
        />
      </ReactNative.View>
    </ReactNative.View>
  );
}
