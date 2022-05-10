import React from "react";
import Svg, { SvgProps } from "../Svg";
import { downloadNetworkAsset } from "../../utils";
import useSvg from "../../hooks/useSvg";

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

  React.useEffect(() => {
    let cancelled = false;

    const downloadEmoji = async (id: string) => {
      const url = idToUrl(id);
      const uri = await downloadNetworkAsset(url);
      if (!cancelled) setFileUri(uri);
    };

    downloadEmoji(id).catch((error) => console.log(error));

    return () => {
      cancelled = true;
    };
  }, [id]);

  return !fileUri ? (
    <Svg width={size} height={size} svg={null} {...otherProps} />
  ) : (
    <PrefetchSvg width={size} height={size} uri={fileUri} {...otherProps} />
  );
}
