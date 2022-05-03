import React from "react";
import Svg, { SvgProps } from "./Svg";
import { useSVG } from "@shopify/react-native-skia";

export type EmojiProps = Omit<SvgProps, "width" | "height" | "svg"> & {
  code: string;
  size: number;
};

const codeToUri: (code: string) => string = (code: string) =>
  `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@v2.034/svg/emoji_u${code}.svg`;

export default function Emoji({ code, size, ...otherProps }: EmojiProps) {
  const uri = codeToUri(code);
  const svg = useSVG(uri);
  return <Svg width={size} height={size} svg={svg} {...otherProps} />;
}
