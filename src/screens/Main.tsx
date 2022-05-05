import tw from "../tailwind";
import ReactNative from "react-native";
import Heading from "../components/text/Heading";
import RegularText from "../components/text/RegularText";
import EmojiCode from "../components/emojis/EmojiCode";
import { useEffect, useState } from "react";
import EmojiGrid from "../components/emojis/EmojiGrid";
import { MainProps } from "../navigation/types";
import { changeScreenOrientation, Orientation } from "../utils";

export default function Main({ route, navigation }: MainProps) {
  const { availableEmojiCodes, codeLength = 3 } = route.params;

  const [code, setCode] = useState<Code>([]);

  const onEmojiSelected: (emojiId: EmojiId) => void = (emojiId: EmojiId) => {
    if (code.length < codeLength) setCode([...code, emojiId]);
  };

  useEffect(() => {
    if (code.length < codeLength) return;
    setCode([]);
    navigation.navigate("play", { code: code });
  }, [code]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      changeScreenOrientation(Orientation.DEFAULT).then().catch(console.log);
    });
  }, [navigation]);

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
        <EmojiCode code={code} length={codeLength} />
      </ReactNative.View>
      <ReactNative.View
        style={tw.style("flex-1", "items-center", "justify-center")}
      >
        <EmojiGrid
          emojiIds={availableEmojiCodes}
          onEmojiSelected={onEmojiSelected}
          style={tw.style("my-4")}
        />
      </ReactNative.View>
    </ReactNative.View>
  );
}
