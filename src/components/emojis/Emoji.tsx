import React from "react";
import Svg, { SvgProps } from "../Svg";
import { downloadNetworkAsset } from "../../utils";
import useSvg from "../../hooks/useSvg";
import useCancellable from "../../hooks/useCancellable";

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
  const svg = useSvg(uri);
  return <Svg svg={svg} {...otherProps} />;
}

export default function Emoji({ id, size, ...otherProps }: EmojiProps) {
  const [fileUri, setFileUri] = React.useState<string>();

  useCancellable(
    async (cancelInfo) => {
      const url = idToUrl(id);
      const uri = await downloadNetworkAsset(url);
      if (!cancelInfo.cancelled) setFileUri(uri);
    },
    [id]
  );

  return !fileUri ? (
    <Svg width={size} height={size} {...otherProps} />
  ) : (
    <PrefetchSvg width={size} height={size} uri={fileUri} {...otherProps} />
  );
}
