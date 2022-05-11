import Slot from "../Slot";
import Emoji from "./Emoji";
import ReactNative from "react-native";
import React from "react";

export type EmojiCodeProps = ReactNative.ViewProps & {
  code: Code;
  length: number;
  size?: number;
  margin?: number;
};

export default function EmojiCode({
  code,
  length,
  size = 50,
  margin = 12,
  style,
  ...otherProps
}: EmojiCodeProps) {
  const internalCode = React.useMemo(
    () => [
      ...code,
      ...Array<string | null>(Math.max(0, length - code.length)).fill(null),
    ],
    [length, JSON.stringify(code)]
  );

  return (
    <ReactNative.View style={[style, { flexDirection: "row" }]} {...otherProps}>
      {internalCode.map((emojiId, index) => (
        <Slot key={index} style={{ margin: margin }}>
          {emojiId !== null ? (
            <Emoji id={emojiId} size={size} />
          ) : (
            <ReactNative.View style={{ width: size, height: size }} />
          )}
        </Slot>
      ))}
    </ReactNative.View>
  );
}
