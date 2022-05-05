import Key, { KeyProps } from "./Key";

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
      foregroundTopColor="#dcdcdc"
      foregroundBottomColor="#f7f7f7"
      sideColor="#ffffff"
      borderColor="#252525"
      {...otherProps}
    />
  );
}
