import { KeyboardLayoutProps } from "./types";
import Heading from "../text/Heading";
import {
  blackKeyHeightScale,
  blackKeyWidthScale,
  defaultKeyboardLayoutProps,
  flatsIndex,
  keyColors,
  octaveBlackNotes,
  octaveWhiteNotes,
} from "./constants";
import React from "react";
import ReactNative from "react-native";
import equal from "fast-deep-equal/react";

export type KeyboardHintOverlayProps = KeyboardLayoutProps;

function KeyboardHintOverlay({
  octavesNumber = defaultKeyboardLayoutProps.octavesNumber,
  keyWidth = defaultKeyboardLayoutProps.keyWidth,
  keyHeight = defaultKeyboardLayoutProps.keyHeight,
  spacing = defaultKeyboardLayoutProps.spacing,
}: KeyboardHintOverlayProps) {
  const octaveNums = React.useMemo(
    () => [...Array(octavesNumber).keys()].map((octave) => octave + 1),
    [octavesNumber]
  );

  const blackKeyWidth = keyWidth * blackKeyWidthScale;
  const blackKeyHeight = keyHeight * blackKeyHeightScale;

  return (
    <ReactNative.View style={{ flexDirection: "row", paddingLeft: spacing }}>
      {octaveNums.map((octave) => (
        <ReactNative.View key={octave.toString()}>
          <ReactNative.View
            style={{ flexDirection: "row", paddingVertical: spacing }}
          >
            {octaveWhiteNotes.map((note) => (
              <ReactNative.View
                key={note + octave}
                style={{
                  width: keyWidth,
                  height: keyHeight,
                  marginRight: spacing,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <ReactNative.View
                  style={{
                    width: 0.5 * keyWidth,
                    height: 0.5 * keyWidth,
                    margin: 0.25 * keyWidth,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Heading
                    style={{
                      fontSize: 0.25 * keyWidth,
                      includeFontPadding: false,
                      marginBottom: 0,
                      color: keyColors.black.foregroundTop,
                    }}
                  >
                    {note + octave}
                  </Heading>
                </ReactNative.View>
              </ReactNative.View>
            ))}
          </ReactNative.View>
          <ReactNative.View style={{ position: "absolute" }}>
            {octaveBlackNotes.map((note) => (
              <ReactNative.View
                key={note + octave}
                style={{
                  position: "absolute",
                  top: spacing,
                  start:
                    flatsIndex[note] * (keyWidth + spacing) +
                    0.5 * spacing -
                    0.5 * (blackKeyWidth + 2 * spacing),
                  width: blackKeyWidth,
                  height: blackKeyHeight,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <ReactNative.View
                  style={{
                    width: 0.5 * blackKeyWidth,
                    height: 0.5 * blackKeyWidth,
                    margin: 0.25 * blackKeyWidth,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Heading
                    style={{
                      fontSize: 0.25 * blackKeyWidth,
                      includeFontPadding: false,
                      marginBottom: 0,
                      color: keyColors.white.foregroundBottom,
                    }}
                  >
                    {note + octave}
                  </Heading>
                </ReactNative.View>
              </ReactNative.View>
            ))}
          </ReactNative.View>
        </ReactNative.View>
      ))}
    </ReactNative.View>
  );
}

export default React.memo(KeyboardHintOverlay, equal);
