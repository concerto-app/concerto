import React from "react";
import Svg, { SvgProps } from "../Svg";
import { useSVG } from "@shopify/react-native-skia";
import useNetworkAsset from "../../hooks/useNetworkAsset";

export type EmojiProps = Omit<SvgProps, "width" | "height" | "svg"> & {
  id: EmojiId;
  size: number;
};

const idToUrl: (code: string) => string = (code: string) =>
  `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@v2.034/svg/emoji_u${code}.svg`;

function PrefetchSvg({
  uri,
  ...otherProps
}: Omit<SvgProps, "svg"> & { uri: string }) {
  const svg = useSVG(uri);
  return <Svg svg={svg} {...otherProps} />;
}

export default function Emoji({ id, size, ...otherProps }: EmojiProps) {
  const url = idToUrl(id);
  const fileUri = useNetworkAsset(url);
  return fileUri === null ? (
    <Svg width={size} height={size} svg={null} {...otherProps} />
  ) : (
    <PrefetchSvg width={size} height={size} uri={fileUri} {...otherProps} />
  );
}
