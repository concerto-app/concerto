import Emoji, { EmojiProps } from "./Emoji";
import { Shadow } from "@shopify/react-native-skia";
import React from "react";
import { Color } from "@shopify/react-native-skia/src/skia/Color";

export type EmojiSymbolProps = EmojiProps & {
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowColor?: Color;
};

export default function EmojiSymbol({
  shadowX = 0,
  shadowY = 8,
  shadowBlur = 10,
  shadowColor = "#0000001a",
  ...otherProps
}: EmojiSymbolProps) {
  return (
    <Emoji {...otherProps}>
      <Shadow dx={shadowX} dy={shadowY} blur={shadowBlur} color={shadowColor} />
    </Emoji>
  );
}
