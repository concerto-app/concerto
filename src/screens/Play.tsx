import tw from "../tailwind";
import ReactNative from "react-native";
import { PlayProps } from "../navigation/types";
import React, { useState } from "react";
import Keyboard from "../components/keyboard/Keyboard";
import { BorderlessButton, ScrollView } from "react-native-gesture-handler";
import Marker from "../components/Marker";
import Emoji from "../components/emojis/Emoji";
import Indicator from "../components/Indicator";
import { mapMap } from "../utils";
import Player, { loadPlayer } from "../sound/Player";
import { useSettings } from "../contexts/settings";
import { allOctaveNotes } from "../components/keyboard/constants";
import KeyboardHintOverlay from "../components/keyboard/KeyboardHintOverlay";
import { debounce } from "lodash";

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

  const [scrolling, setScrolling] = useState<boolean>(false);
  const [keyboardState, setKeyboardState] = useState<KeyboardState>(new Map());
  const [player, setPlayer] = useState<Player>();

  const settings = useSettings();

  const getUserEmoji = (user: UserId) => "1f349";

  const getCurrentUser = () => "me";

  const getAllUsers = () => [getCurrentUser()];

  const handleKeyPressedIn = (
    key: Key,
    user: UserId,
    player?: Player,
    velocity?: number
  ) => {
    setKeyboardState((prevState) => {
      if (prevState.has(key)) return prevState;
      if (player && velocity) player.start(key, velocity).then();
      return new Map(prevState).set(key, user);
    });
  };

  const handleKeyPressedOut = (
    key: Key,
    user: UserId,
    player?: Player,
    velocity?: number
  ) => {
    setKeyboardState((prevState) => {
      if (!prevState.has(key) || prevState.get(key) !== user) return prevState;
      if (player && velocity) player.stop(key, velocity).then();
      const stateCopy = new Map(prevState);
      stateCopy.delete(key);
      return stateCopy;
    });
  };

  const handleUserKeyPressedIn = React.useCallback(
    (note: string, octave: number) =>
      handleKeyPressedIn(
        note + octave,
        getCurrentUser(),
        player,
        settings.noteOnVelocity.value === undefined
          ? undefined
          : Number(settings.noteOnVelocity.value)
      ),
    [player, settings.noteOnVelocity.value]
  );

  const handleUserKeyPressedOut = React.useCallback(
    (note: string, octave: number) =>
      handleKeyPressedOut(
        note + octave,
        getCurrentUser(),
        player,
        settings.noteOffVelocity.value === undefined
          ? undefined
          : Number(settings.noteOffVelocity.value)
      ),
    [player, settings.noteOffVelocity.value]
  );

  const handleSettingsButtonPress = React.useCallback(() => {
    navigation.navigate("settings", {
      code: code,
      users: getAllUsers().map((user) => [user, getUserEmoji(user)]),
    });
  }, []);

  const debouncer = React.useRef(debounce((value) => setScrolling(value), 500));

  const handleScrollStart = React.useCallback(() => {
    debouncer.current.cancel();
    setScrolling(true);
  }, [debouncer]);
  const handleScrollEnd = React.useCallback(() => debouncer.current(false), []);

  React.useEffect(() => {
    if (!settings.instrument.value) return;

    let cancelled = false;

    const getPlayer = async (instrument: string, notes: string[]) => {
      player && (await player.destroy());
      const newPlayer = await loadPlayer(instrument, notes);
      cancelled ? await newPlayer.destroy() : setPlayer(newPlayer);
    };

    getPlayer(settings.instrument.value, allNotes).catch((error) =>
      console.log(error)
    );

    return () => {
      cancelled = true;
    };
  }, [settings.instrument.value, allNotes]);

  if (!player) return null;

  return (
    <ReactNative.View style={tw.style("flex-1", "bg-white")}>
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollStart}
        onEnded={handleScrollEnd}
      >
        <ReactNative.View style={{ flex: 1, justifyContent: "flex-end" }}>
          <ReactNative.View>
            <Keyboard
              pressedKeys={mapMap(keyboardState, (user) => ({
                emojiId: getUserEmoji(user),
              }))}
              onKeyPressedIn={handleUserKeyPressedIn}
              onKeyPressedOut={handleUserKeyPressedOut}
              octavesNumber={octaves}
            />
            <ReactNative.View
              pointerEvents="none"
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                display: scrolling ? "flex" : "none",
              }}
            >
              <KeyboardHintOverlay />
            </ReactNative.View>
          </ReactNative.View>
        </ReactNative.View>
      </ScrollView>
      <ReactNative.View
        style={tw.style("w-full", "h-full", "absolute", "items-end")}
      >
        <SettingsButton
          text="2"
          emojiId={getUserEmoji(getCurrentUser())}
          size={buttonSize}
          margin={buttonMargin}
          onPress={handleSettingsButtonPress}
        />
      </ReactNative.View>
    </ReactNative.View>
  );
}
