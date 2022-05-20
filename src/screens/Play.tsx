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
import Player from "../sound/Player";
import { useSettings } from "../contexts/settings";
import KeyboardHintOverlay from "../components/keyboard/KeyboardHintOverlay";
import { debounce } from "lodash";
import useCancellable from "../hooks/useCancellable";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import { RoomEvent } from "../server/Room";
import { addUser, removeUser, setUsers } from "../state/slices/users";
import { getNotesForRange } from "../sound/utils";
import { useRoom } from "../contexts/room";
import { useMidi } from "../contexts/midi";
import { usePlayer } from "../contexts/player";
import { defaultMidiInput } from "../constants";
import { User } from "../server/models";

type KeyboardState = Map<number, string>;

const octaves = 7;
const buttonSize = 45;
const buttonMargin = 16;

const allNotes = getNotesForRange(octaves);

const fallbackEmoji = "1f32d";

function SettingsButton({
  text,
  emojiId,
  size,
  margin,
  onPress,
}: {
  text: string;
  emojiId: string;
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
  const [keyboardState, setKeyboardState] = React.useState<KeyboardState>(
    new Map()
  );

  const room = useRoom();
  const midi = useMidi();
  const player = usePlayer();
  const settings = useSettings();

  const dispatch = useAppDispatch();
  const code = useAppSelector((state) => state.code.code);
  const users = useAppSelector((state) => state.users.users);

  const [user, setUser] = React.useState<string>();

  const getUserEmoji = (userId: string) =>
    users.find((user) => user.id === userId)?.emoji;

  const handleKeyPressedIn = (
    player: Player,
    note: number,
    user: string,
    velocity: number
  ) => {
    setKeyboardState((prevState) => {
      if (prevState.has(note)) return prevState;
      player.start(note, velocity).then();
      return new Map(prevState).set(note, user);
    });
  };

  const handleKeyPressedOut = (
    player: Player,
    note: number,
    user: string,
    velocity: number
  ) => {
    setKeyboardState((prevState) => {
      if (!prevState.has(note) || prevState.get(note) !== user)
        return prevState;
      player.stop(note, velocity).then();
      const stateCopy = new Map(prevState);
      stateCopy.delete(note);
      return stateCopy;
    });
  };

  const handleUserKeyPressedIn = React.useCallback(
    (note: number, velocity: number) => {
      room.dispatch({
        note: note,
        type: "press",
        velocity: velocity,
      });
    },
    [room]
  );

  const handleUserScreenKeyPressedIn = React.useCallback(
    (note: number) => {
      if (settings.noteOnVelocity.value === undefined) return;
      handleUserKeyPressedIn(note, Number(settings.noteOnVelocity.value));
    },
    [handleUserKeyPressedIn, settings.noteOnVelocity.value]
  );

  const handleUserMidiKeyPressedIn = React.useCallback(
    (note: number, velocity: number) => handleUserKeyPressedIn(note, velocity),
    [handleUserKeyPressedIn]
  );

  const handleUserKeyPressedOut = React.useCallback(
    (note: number, velocity: number) => {
      room.dispatch({
        note: note,
        type: "release",
        velocity: velocity,
      });
    },
    [room]
  );

  const handleUserScreenKeyPressedOut = React.useCallback(
    (note: number) => {
      if (settings.noteOffVelocity.value === undefined) return;
      handleUserKeyPressedOut(note, Number(settings.noteOffVelocity.value));
    },
    [handleUserKeyPressedOut, settings.noteOffVelocity.value]
  );

  const handleUserMidiKeyPressedOut = React.useCallback(
    (note: number, velocity: number) => handleUserKeyPressedOut(note, velocity),
    [handleUserKeyPressedOut]
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

  const handleScrollEnd = React.useCallback(
    () => debouncer(false),
    [debouncer]
  );

  const handleRoomConnected = React.useCallback(
    (user: User, connectedUsers: User[]) => {
      dispatch(
        setUsers(
          [user, ...connectedUsers].map((user) => ({
            id: user.id,
            emoji: user.avatar.emoji.id,
          }))
        )
      );
      setUser(user.id);
    },
    [dispatch]
  );

  const handleUserConnected = React.useCallback(
    (user: User) => {
      dispatch(
        addUser({
          id: user.id,
          emoji: user.avatar.emoji.id,
        })
      );
    },
    [dispatch]
  );

  const handleUserDisconnected = React.useCallback(
    (id: string) => dispatch(removeUser(id)),
    [dispatch]
  );

  const handleRoomEvent = React.useCallback(
    (event: RoomEvent) => {
      switch (event.action.type) {
        case "press":
          return handleKeyPressedIn(
            player.player,
            event.action.note,
            event.user,
            event.action.velocity
          );
        case "release":
          return handleKeyPressedOut(
            player.player,
            event.action.note,
            event.user,
            event.action.velocity
          );
      }
    },
    [player.player]
  );

  useCancellable(() => {
    if (!code) return;
    room
      .connect(
        code,
        handleRoomConnected,
        handleUserConnected,
        handleUserDisconnected,
        handleRoomEvent
      )
      .then();
    return () => {
      room.disconnect().then();
    };
  }, [
    room,
    JSON.stringify(code),
    handleRoomConnected,
    handleUserConnected,
    handleUserDisconnected,
    handleRoomEvent,
  ]);

  useCancellable(() => {
    if (
      settings.midiInput.value === undefined ||
      settings.midiInput.value === defaultMidiInput
    )
      return;
    midi.controller.disconnect();
    midi.controller.connect(
      Number(settings.midiInput.value),
      handleUserMidiKeyPressedIn,
      handleUserMidiKeyPressedOut
    );
    return () => {
      midi.controller.disconnect();
    };
  }, [
    midi.controller,
    settings.midiInput.value,
    handleUserMidiKeyPressedIn,
    handleUserMidiKeyPressedOut,
  ]);

  useCancellable(() => {
    if (settings.instrument.value === undefined) return;

    const load = async (instrument: string, notes: number[]) => {
      await player.player.unload();
      await player.player.load(instrument, notes);
    };

    load(settings.instrument.value, allNotes).then();

    return () => {
      player.player.unload().then();
    };
  }, [player.player, settings.instrument.value, JSON.stringify(allNotes)]);

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
              onKeyPressedIn={handleUserScreenKeyPressedIn}
              onKeyPressedOut={handleUserScreenKeyPressedOut}
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
          text={users.length.toString()}
          emojiId={user ? getUserEmoji(user) || fallbackEmoji : fallbackEmoji}
          size={buttonSize}
          margin={buttonMargin}
          onPress={handleSettingsButtonPress}
        />
      </ReactNative.View>
    </ReactNative.View>
  );
}
