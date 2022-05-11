import tw from "../tailwind";
import ReactNative from "react-native";
import { PlayProps } from "../navigation/types";
import React from "react";
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
import useCancellable from "../hooks/useCancellable";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import Room, { RoomEvent } from "../Room";
import { addUser, removeUser } from "../state/slices/users";

type KeyboardState = Map<Key, UserId>;

const octaves = 7;
const buttonSize = 45;
const buttonMargin = 16;

const octaveNums = [...Array(octaves).keys()].map((octave) => octave + 1);
const allNotes = allOctaveNotes.flatMap((note) =>
  octaveNums.map((octave) => note + octave)
);

const fallbackEmoji = "1f32d";

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

export default function Play({ navigation }: PlayProps) {
  const [scrolling, setScrolling] = React.useState<boolean>(false);
  const [player, setPlayer] = React.useState<Player>();
  const [room, setRoom] = React.useState<Room>();
  const [keyboardState, setKeyboardState] = React.useState<KeyboardState>(
    new Map()
  );

  const settings = useSettings();

  const dispatch = useAppDispatch();
  const code = useAppSelector((state) => state.code.code);
  const users = useAppSelector((state) => state.users.users);

  const getUserEmoji = (userId: UserId) =>
    users.find((user) => user.id === userId)?.emoji;

  const handleKeyPressedIn = (key: Key, user: UserId, velocity?: number) => {
    setKeyboardState((prevState) => {
      if (prevState.has(key)) return prevState;
      if (player && velocity) player.start(key, velocity).then();
      return new Map(prevState).set(key, user);
    });
  };

  const handleKeyPressedOut = (key: Key, user: UserId, velocity?: number) => {
    setKeyboardState((prevState) => {
      if (!prevState.has(key) || prevState.get(key) !== user) return prevState;
      if (player && velocity) player.stop(key, velocity).then();
      const stateCopy = new Map(prevState);
      stateCopy.delete(key);
      return stateCopy;
    });
  };

  const handleUserKeyPressedIn = React.useCallback(
    (note: string, octave: number) => {
      if (!room || !player || settings.noteOnVelocity.value === undefined)
        return;
      room.dispatch({
        key: note + octave,
        type: "press",
        velocity: Number(settings.noteOffVelocity.value),
      });
    },
    [room, settings.noteOnVelocity.value]
  );

  const handleUserKeyPressedOut = React.useCallback(
    (note: string, octave: number) => {
      if (!room || !player || settings.noteOffVelocity.value === undefined)
        return;
      room.dispatch({
        key: note + octave,
        type: "release",
        velocity: Number(settings.noteOffVelocity.value),
      });
    },
    [room, settings.noteOffVelocity.value]
  );

  const handleSettingsButtonPress = React.useCallback(() => {
    navigation.navigate("settings", {});
  }, [navigation]);

  const debouncer = React.useRef(
    debounce((value) => setScrolling(value), 500)
  ).current;

  const handleScrollStart = React.useCallback(() => {
    debouncer.cancel();
    setScrolling(true);
  }, [debouncer]);
  const handleScrollEnd = React.useCallback(() => debouncer(false), []);

  const handleRoomConnected = React.useCallback(
    (id: UserId, emoji: EmojiId) => {
      dispatch(
        addUser({
          id: id,
          emoji: emoji,
        })
      );
    },
    [dispatch]
  );

  const handleUserConnected = React.useCallback(
    (id: UserId, emoji: EmojiId) => {
      dispatch(
        addUser({
          id: id,
          emoji: emoji,
        })
      );
    },
    [dispatch]
  );

  const handleUserDisconnected = React.useCallback(
    (id: UserId) => dispatch(removeUser(id)),
    [dispatch]
  );

  const handleRoomEvent = React.useCallback(
    (event: RoomEvent) => {
      if (!player) return;
      switch (event.action.type) {
        case "press":
          return handleKeyPressedIn(
            event.action.key,
            event.user,
            event.action.velocity
          );
        case "release":
          return handleKeyPressedOut(
            event.action.key,
            event.user,
            event.action.velocity
          );
      }
    },
    [player]
  );

  useCancellable(
    (cancelInfo) => {
      if (!code) return;
      const room = new Room(
        code,
        handleRoomConnected,
        handleUserConnected,
        handleUserDisconnected,
        handleRoomEvent
      );
      cancelInfo.cancelled ? room.disconnect() : setRoom(room);
    },
    [
      code,
      handleRoomConnected,
      handleUserConnected,
      handleUserDisconnected,
      handleRoomEvent,
    ]
  );

  useCancellable(
    async (cancelInfo) => {
      if (!settings.instrument.value) return;
      player && (await player.destroy());
      const newPlayer = await loadPlayer(settings.instrument.value, allNotes);
      cancelInfo.cancelled ? await newPlayer.destroy() : setPlayer(newPlayer);
    },
    [settings.instrument.value, allNotes]
  );

  if (!player || !room) return null;

  const currentUserEmoji = getUserEmoji(room.currentUser);

  if (!currentUserEmoji) return null;

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
                emojiId: getUserEmoji(user) || fallbackEmoji,
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
          emojiId={currentUserEmoji}
          size={buttonSize}
          margin={buttonMargin}
          onPress={handleSettingsButtonPress}
        />
      </ReactNative.View>
    </ReactNative.View>
  );
}
