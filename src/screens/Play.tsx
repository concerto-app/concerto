import tw from "../tailwind";
import ReactNative from "react-native";
import { PlayProps } from "../navigation/types";
import React, { useState } from "react";
import Keyboard, { allOctaveNotes } from "../components/keyboard/Keyboard";
import { BorderlessButton, ScrollView } from "react-native-gesture-handler";
import Marker from "../components/Marker";
import Emoji from "../components/emojis/Emoji";
import Indicator from "../components/Indicator";
import { mapMap } from "../utils";
import { useSettings } from "../contexts/settings";

type KeyboardState = Map<Key, UserId>;

const octaves = 7;
const buttonSize = 45;
const buttonMargin = 16;

const octaveNums = [...Array(octaves).keys()].map((octave) => octave + 1);
const allNotes = allOctaveNotes.flatMap((note) =>
  octaveNums.map((octave) => note + octave)
);

function SettingsButton({
  text,
  emojiId,
  size,
  margin,
  onPress,
}: {
  text: string;
  emojiId: EmojiId;
  size: number;
  margin: number;
  onPress?: (pointerInside: boolean) => void;
}) {
  const indicatorOffset = margin + 0.5 * size - size / 6 + size / 3;
  return (
    <BorderlessButton onPress={onPress}>
      <Marker size={size} style={{ margin: margin }}>
        <Emoji id={emojiId} size={(size * 3) / 5} />
      </Marker>
      <Indicator
        size={size / 3}
        text={text}
        style={{
          position: "absolute",
          left: indicatorOffset,
          top: indicatorOffset,
          elevation: 999,
          zIndex: 999,
        }}
      />
    </BorderlessButton>
  );
}

export default function Play({ route, navigation }: PlayProps) {
  const { code } = route.params;

  const [keyboardState, setKeyboardState] = useState<KeyboardState>(new Map());

  const settings = useSettings();

  const getUserEmojiCode = (user: UserId) => "1f349";

  const getCurrentUser = () => "me";

  const getAllUsers = () => [getCurrentUser()];

  const handleKeyPressedIn = (key: Key, user: UserId) => {
    setKeyboardState((prevState) => {
      if (prevState.has(key)) return prevState;
      return new Map(prevState).set(key, user);
    });
  };

  const handleKeyPressedOut = (key: Key, user: UserId) => {
    setKeyboardState((prevState) => {
      if (!prevState.has(key) || prevState.get(key) !== user) return prevState;
      const stateCopy = new Map(prevState);
      stateCopy.delete(key);
      return stateCopy;
    });
  };

  const handleUserKeyPressedIn = React.useCallback(
    (note: string, octave: number) =>
      handleKeyPressedIn(note + octave, getCurrentUser()),
    []
  );

  const handleUserKeyPressedOut = React.useCallback(
    (note: string, octave: number) =>
      handleKeyPressedOut(note + octave, getCurrentUser()),
    []
  );

  const handleSettingsButtonPress = React.useCallback(() => {
    navigation.navigate("settings", {
      code: code,
      users: getAllUsers().map((user) => [user, getUserEmojiCode(user)]),
    });
  }, []);

  return (
    <ReactNative.View style={tw.style("flex-1", "bg-white")}>
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ReactNative.View style={tw.style("flex-1", "justify-end")}>
          <Keyboard
            pressedKeys={mapMap(keyboardState, (user) => ({
              emojiCode: getUserEmojiCode(user),
            }))}
            onKeyPressedIn={handleUserKeyPressedIn}
            onKeyPressedOut={handleUserKeyPressedOut}
            octavesNumber={octaves}
          />
        </ReactNative.View>
      </ScrollView>
      <ReactNative.View
        style={tw.style("w-full", "h-full", "absolute", "items-end")}
      >
        <SettingsButton
          text="2"
          emojiId={getUserEmojiCode(getCurrentUser())}
          size={buttonSize}
          margin={buttonMargin}
          onPress={handleSettingsButtonPress}
        />
      </ReactNative.View>
    </ReactNative.View>
  );
}
