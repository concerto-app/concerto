import ReactNative from "react-native";
import WhiteKey from "./WhiteKey";
import tw from "../../tailwind";
import BlackKey from "./BlackKey";
import { TouchableOpacity } from "react-native-gesture-handler";
import React from "react";
import Touchable from "../Touchable";
import { PressedInfo } from "./Key";

export type PressedKeys = Map<string, PressedInfo>;

export type KeyboardProps = ReactNative.ViewProps & {
  pressedKeys: PressedKeys;
  octavesNumber?: number;
  borderColor?: string;
  keyWidth?: number;
  keyHeight?: number;
  spacing?: number;
  onKeyPressedIn?: (note: string, octave: number) => void;
  onKeyPressedOut?: (note: string, octave: number) => void;
};

const octaveWhiteNotes: Array<string> = ["C", "D", "E", "F", "G", "A", "B"];
const octaveBlackNotes: Array<string> = ["C#", "D#", "F#", "G#", "A#"];

const sharpsIndex: Record<string, number> = {
  "C#": 1,
  "D#": 2,
  "F#": 4,
  "G#": 5,
  "A#": 6,
};

const noteColors: Record<string, string> = {
  C: "#ff0939",
  "C#": "#ff9244",
  D: "#fffc58",
  "D#": "#83fe56",
  E: "#00ff54",
  F: "#00ffa1",
  "F#": "#00fffe",
  G: "#009ffa",
  "G#": "#0047f8",
  A: "#9a41f8",
  "A#": "#ff32f9",
  B: "#ff1c97",
};

const InternalWhiteKey = (props: {
  note: string;
  octave: number;
  spacing: number;
  onKeyPressedIn: (note: string, octave: number) => void;
  onKeyPressedOut: (note: string, octave: number) => void;
  keyWidth: number;
  keyHeight: number;
  pressed?: PressedInfo;
}) => {
  return (
    <ReactNative.View style={{ marginRight: props.spacing }}>
      <TouchableOpacity
        activeOpacity={1.0}
        onPressIn={() => props.onKeyPressedIn(props.note, props.octave)}
        onPressOut={() => props.onKeyPressedOut(props.note, props.octave)}
        extraButtonProps={{
          rippleColor: "#00000000",
          exclusive: false,
        }}
      >
        <WhiteKey
          width={props.keyWidth}
          height={props.keyHeight}
          borderWidth={0}
          pressed={props.pressed}
          pressedColor={noteColors[props.note]}
        />
      </TouchableOpacity>
    </ReactNative.View>
  );
};

const InternalBlackKey = (props: {
  note: string;
  octave: number;
  spacing: number;
  onKeyPressedIn: (note: string, octave: number) => void;
  onKeyPressedOut: (note: string, octave: number) => void;
  keyWidth: number;
  keyHeight: number;
  whiteKeyWidth: number;
  pressed?: PressedInfo;
}) => (
  <ReactNative.View
    style={{
      position: "absolute",
      start:
        sharpsIndex[props.note] * (props.whiteKeyWidth + props.spacing) -
        0.5 * props.spacing -
        0.5 * (props.keyWidth + 2 * props.spacing),
    }}
  >
    <Touchable
      activeOpacity={1.0}
      onPressIn={() => props.onKeyPressedIn(props.note, props.octave)}
      onPressOut={() => props.onKeyPressedOut(props.note, props.octave)}
    >
      <BlackKey
        width={props.keyWidth}
        height={props.keyHeight}
        borderWidth={props.spacing}
        pressed={props.pressed}
        pressedColor={noteColors[props.note]}
        style={tw.style("shadow-xl")}
      />
    </Touchable>
  </ReactNative.View>
);

const MemoizedWhiteKey = React.memo(
  InternalWhiteKey,
  (prevProps, nextProps) => {
    const {
      onKeyPressedIn: f11,
      onKeyPressedOut: f12,
      ...otherPrevProps
    } = prevProps;
    const {
      onKeyPressedIn: f21,
      onKeyPressedOut: f22,
      ...otherNextProps
    } = nextProps;
    return JSON.stringify(otherPrevProps) === JSON.stringify(otherNextProps);
  }
);

const MemoizedBlackKey = React.memo(
  InternalBlackKey,
  (prevProps, nextProps) => {
    const {
      onKeyPressedIn: f11,
      onKeyPressedOut: f12,
      ...otherPrevProps
    } = prevProps;
    const {
      onKeyPressedIn: f21,
      onKeyPressedOut: f22,
      ...otherNextProps
    } = nextProps;
    return JSON.stringify(otherPrevProps) === JSON.stringify(otherNextProps);
  }
);

export default function Keyboard({
  pressedKeys,
  octavesNumber = 7,
  borderColor = "#252525",
  keyWidth = 90,
  keyHeight = 230,
  spacing = 5,
  style,
  onKeyPressedIn = () => {},
  onKeyPressedOut = () => {},
  ...otherProps
}: KeyboardProps) {
  const blackKeyWidth = (keyWidth * 2) / 3;
  const blackKeyHeight = 0.5 * keyHeight;

  return (
    <ReactNative.View
      style={tw.style("flex-row", {
        paddingLeft: spacing,
        backgroundColor: borderColor,
      })}
      {...otherProps}
    >
      {[...Array(octavesNumber).keys()].map((octave) => (
        <ReactNative.View key={octave.toString()}>
          <ReactNative.View
            style={{ flexDirection: "row", paddingVertical: spacing }}
          >
            {octaveWhiteNotes.map((note) => (
              <MemoizedWhiteKey
                key={note + octave}
                note={note}
                octave={octave}
                spacing={spacing}
                onKeyPressedIn={onKeyPressedIn}
                onKeyPressedOut={onKeyPressedOut}
                keyWidth={keyWidth}
                keyHeight={keyHeight}
                pressed={pressedKeys.get(note + octave)}
              />
            ))}
          </ReactNative.View>
          <ReactNative.View style={tw.style("absolute", "flex-row")}>
            {octaveBlackNotes.map((note) => (
              <MemoizedBlackKey
                key={note + octave}
                note={note}
                octave={octave}
                spacing={spacing}
                onKeyPressedIn={onKeyPressedIn}
                onKeyPressedOut={onKeyPressedOut}
                keyWidth={blackKeyWidth}
                keyHeight={blackKeyHeight}
                whiteKeyWidth={keyWidth}
                pressed={pressedKeys.get(note + octave)}
              />
            ))}
          </ReactNative.View>
        </ReactNative.View>
      ))}
    </ReactNative.View>
  );
}
