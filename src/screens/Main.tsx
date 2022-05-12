import tw from "../tailwind";
import ReactNative from "react-native";
import Heading from "../components/text/Heading";
import RegularText from "../components/text/RegularText";
import EmojiCode from "../components/emojis/EmojiCode";
import React from "react";
import EmojiGrid from "../components/emojis/EmojiGrid";
import { MainProps } from "../navigation/types";
import useAppDispatch from "../hooks/useAppDispatch";
import { resetCode, setCode } from "../state/slices/code";
import useCancellable from "../hooks/useCancellable";
import { resetUsers } from "../state/slices/users";

export default function Main({ route, navigation }: MainProps) {
  const { availableEmojiCodes, codeLength = 3 } = route.params;

  const [localCode, setLocalCode] = React.useState<Code>([]);

  const dispatch = useAppDispatch();

  const onEmojiSelected: (emojiId: EmojiId) => void = (emojiId: EmojiId) => {
    if (localCode.length < codeLength) setLocalCode([...localCode, emojiId]);
  };

  React.useEffect(() => {
    const callback = () => {
      setLocalCode([]);
      dispatch(resetCode());
      dispatch(resetUsers());
    };
    navigation.addListener("focus", callback);
    return () => {
      navigation.removeListener("focus", callback);
    };
  }, [navigation]);

  useCancellable(
    (cancelInfo) => {
      if (localCode.length < codeLength) return;
      if (!cancelInfo.cancelled) {
        dispatch(setCode(localCode));
        navigation.navigate("play", {});
      }
    },
    [JSON.stringify(localCode)]
  );

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
        <EmojiCode code={localCode} length={codeLength} />
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
