import Key, { KeyProps } from "./Key";

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
      foregroundTopColor="#252525"
      foregroundBottomColor="#353535"
      sideColor="#5b5b5b"
      borderColor="#252525"
      {...otherProps}
    />
  );
}
