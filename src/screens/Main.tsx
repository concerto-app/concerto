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
import { codeLength, urls } from "../constants";
import useFetch from "../hooks/useFetch";
import { EntriesResponse } from "../server/models";
import Loading from "../components/Loading";

export default function Main({ route, navigation }: MainProps) {
  const [localCode, setLocalCode] = React.useState<Array<string>>([]);

  const { status, data, error } = useFetch<EntriesResponse>(urls.entries);

  const dispatch = useAppDispatch();

  const onEmojiSelected: (emojiId: string) => void = (emojiId: string) => {
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

  React.useEffect(() => {
    if (error !== undefined)
      navigation.navigate("error", { message: "Can't connect to server" });
  }, [navigation, JSON.stringify(error)]);

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

  if (status === "idle" || status === "fetching" || data === undefined)
    return <Loading />;

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
          emojiIds={data.available.map((emoji) => emoji.id)}
          onEmojiSelected={onEmojiSelected}
          style={tw.style("my-8")}
        />
      </ReactNative.View>
    </ReactNative.View>
  );
}
