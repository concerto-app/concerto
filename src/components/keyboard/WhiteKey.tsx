import Key, { KeyProps } from "./Key";
import { keyColors } from "./constants";

export type WhiteKeyProps = Omit<
  KeyProps,
  | "width"
  | "height"
  | "foregroundTopColor"
  | "foregroundBottomColor"
  | "sideColor"
  | "borderColor"
> & {
  width?: number;
  height?: number;
};

export default function WhiteKey({
  width = 90,
  height = 230,
  ...otherProps
}: WhiteKeyProps) {
  return (
    <Key
      width={width}
      height={height}
      foregroundTopColor={keyColors.white.foregroundTop}
      foregroundBottomColor={keyColors.white.foregroundBottom}
      sideColor={keyColors.white.side}
      borderColor={keyColors.white.border}
      {...otherProps}
    />
  );
}
