import Key, { KeyProps } from "./Key";
import { keyColors } from "./constants";

export type BlackKeyProps = Omit<
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

export default function BlackKey({
  width = 60,
  height = 115,
  ...otherProps
}: BlackKeyProps) {
  return (
    <Key
      width={width}
      height={height}
      foregroundTopColor={keyColors.black.foregroundTop}
      foregroundBottomColor={keyColors.black.foregroundBottom}
      sideColor={keyColors.black.side}
      borderColor={keyColors.black.border}
      {...otherProps}
    />
  );
}
