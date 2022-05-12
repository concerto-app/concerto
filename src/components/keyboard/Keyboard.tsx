import ReactNative from "react-native";
import WhiteKey from "./WhiteKey";
import tw from "../../tailwind";
import BlackKey from "./BlackKey";
import React from "react";
import Touchable from "../Touchable";
import { PressedInfo } from "./Key";
import equal from "fast-deep-equal/react";
import { KeyboardProps } from "./types";
import {
  blackKeyHeightScale,
  blackKeyWidthScale,
  blacksGapIndex,
  defaultKeyboardLayoutProps,
  noteNameColors,
} from "./constants";
import { getName, toNote } from "../../sound/utils";
import { blackNoteNames, whiteNoteNames } from "../../sound/constants";

type InternalKeyProps = {
  note: number;
  spacing: number;
  onKeyPressedIn: (note: number) => void;
  onKeyPressedOut: (note: number) => void;
  keyWidth: number;
  keyHeight: number;
  keyDepth: number;
  pressed?: PressedInfo;
};

type InternalWhiteKeyProps = InternalKeyProps;
type InternalBlackKeyProps = InternalKeyProps & { whiteKeyWidth: number };

const InternalWhiteKey = (props: InternalWhiteKeyProps) => {
  return (
    <ReactNative.View
      style={{
        width: props.keyWidth,
        height: props.keyHeight,
        marginRight: props.spacing,
      }}
    >
      <Touchable
        activeOpacity={1.0}
        onPressIn={() => props.onKeyPressedIn(props.note)}
        onPressOut={() => props.onKeyPressedOut(props.note)}
      >
        <WhiteKey
          width={props.keyWidth}
          height={props.keyHeight}
          borderWidth={0}
          pressed={props.pressed}
          pressedColor={noteNameColors[getName(props.note)]}
          depth={props.keyDepth}
        />
      </Touchable>
    </ReactNative.View>
  );
};

const InternalBlackKey = (props: InternalBlackKeyProps) => (
  <ReactNative.View
    style={{
      position: "absolute",
      start:
        blacksGapIndex[getName(props.note)] *
          (props.whiteKeyWidth + props.spacing) -
        0.5 * props.spacing -
        0.5 * (props.keyWidth + 2 * props.spacing),
    }}
  >
    <Touchable
      activeOpacity={1.0}
      onPressIn={() => props.onKeyPressedIn(props.note)}
      onPressOut={() => props.onKeyPressedOut(props.note)}
    >
      <BlackKey
        width={props.keyWidth}
        height={props.keyHeight}
        borderWidth={props.spacing}
        pressed={props.pressed}
        pressedColor={noteNameColors[getName(props.note)]}
        style={tw.style("shadow-xl")}
        depth={props.keyDepth}
      />
    </Touchable>
  </ReactNative.View>
);

const MemoizedWhiteKey = React.memo(InternalWhiteKey, equal);
const MemoizedBlackKey = React.memo(InternalBlackKey, equal);

export default function Keyboard({
  pressedKeys,
  octavesNumber = defaultKeyboardLayoutProps.octavesNumber,
  borderColor = "#252525",
  keyWidth = defaultKeyboardLayoutProps.keyWidth,
  keyHeight = defaultKeyboardLayoutProps.keyHeight,
  keyDepth = defaultKeyboardLayoutProps.keyDepth,
  spacing = defaultKeyboardLayoutProps.spacing,
  style,
  onKeyPressedIn = () => {},
  onKeyPressedOut = () => {},
  ...otherProps
}: KeyboardProps) {
  const blackKeyWidth = keyWidth * blackKeyWidthScale;
  const blackKeyHeight = keyHeight * blackKeyHeightScale;

  const octaveNums = React.useMemo(
    () => [...Array(octavesNumber).keys()].map((octave) => octave + 1),
    [octavesNumber]
  );

  const makeWhiteKeys = (octave: number) =>
    whiteNoteNames.map((noteName) => {
      const note = toNote(noteName, octave);
      return (
        <MemoizedWhiteKey
          key={note}
          note={note}
          spacing={spacing}
          onKeyPressedIn={onKeyPressedIn}
          onKeyPressedOut={onKeyPressedOut}
          keyWidth={keyWidth}
          keyHeight={keyHeight}
          keyDepth={keyDepth}
          pressed={pressedKeys.get(note)}
        />
      );
    });

  const makeBlackKeys = (octave: number) =>
    blackNoteNames.map((noteName) => {
      const note = toNote(noteName, octave);
      return (
        <MemoizedBlackKey
          key={note}
          note={note}
          spacing={spacing}
          onKeyPressedIn={onKeyPressedIn}
          onKeyPressedOut={onKeyPressedOut}
          keyWidth={blackKeyWidth}
          keyHeight={blackKeyHeight}
          keyDepth={keyDepth}
          whiteKeyWidth={keyWidth}
          pressed={pressedKeys.get(note)}
        />
      );
    });

  return (
    <ReactNative.View
      style={{
        flexDirection: "row",
        paddingLeft: spacing,
        backgroundColor: borderColor,
      }}
      {...otherProps}
    >
      {octaveNums.map((octave) => (
        <ReactNative.View key={octave.toString()}>
          <ReactNative.View
            style={{ flexDirection: "row", paddingVertical: spacing }}
          >
            {makeWhiteKeys(octave)}
          </ReactNative.View>
          <ReactNative.View style={{ position: "absolute" }}>
            {makeBlackKeys(octave)}
          </ReactNative.View>
        </ReactNative.View>
      ))}
    </ReactNative.View>
  );
}
