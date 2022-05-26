import { KeyboardLayoutProps } from "./types";
import Heading from "../text/Heading";
import {
  blackKeyHeightScale,
  blackKeyWidthScale,
  blacksGapIndex,
  defaultKeyboardLayoutProps,
  keyColors,
} from "./constants";
import React from "react";
import ReactNative from "react-native";
import equal from "fast-deep-equal/react";
import { blackNoteNames, whiteNoteNames } from "../../sound/constants";

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
            {whiteNoteNames.map((noteName) => (
              <ReactNative.View
                key={noteName + octave}
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
                    width: keyWidth,
                    height: keyWidth,
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
                    {noteName + octave}
                  </Heading>
                </ReactNative.View>
              </ReactNative.View>
            ))}
          </ReactNative.View>
          <ReactNative.View style={{ position: "absolute" }}>
            {blackNoteNames.map((noteName) => (
              <ReactNative.View
                key={noteName + octave}
                style={{
                  position: "absolute",
                  top: spacing,
                  start:
                    blacksGapIndex[noteName] * (keyWidth + spacing) +
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
                    width: blackKeyWidth,
                    height: blackKeyWidth,
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
                    {noteName + octave}
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
