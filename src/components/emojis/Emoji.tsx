import React from "react";
import Svg, { SvgProps } from "../Svg";
import { useSVG } from "@shopify/react-native-skia";

export type EmojiProps = Omit<SvgProps, "width" | "height" | "svg"> & {
  id: EmojiId;
  size: number;
};

const idToUri: (code: string) => string = (code: string) =>
  `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@v2.034/svg/emoji_u${code}.svg`;

export default function Emoji({ id, size, ...otherProps }: EmojiProps) {
  const uri = idToUri(id);
  const svg = useSVG(uri);
  return <Svg width={size} height={size} svg={svg} {...otherProps} />;
}
