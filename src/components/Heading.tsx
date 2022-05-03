import ReactNative from "react-native";

export type HeadingProps = Omit<ReactNative.TextProps, "style"> & {
  style?: Omit<ReactNative.TextStyle, "fontFamily">;
};

const defaultStyleProps = {
  marginBottom: 8,
  fontSize: 30,
};

const overrideStyleProps = {
  fontFamily: "Nunito_800ExtraBold",
};

export default function Heading({
  style: propStyle,
  ...otherProps
}: HeadingProps) {
  const style: ReactNative.TextStyle = {
    ...defaultStyleProps,
    ...propStyle,
    ...overrideStyleProps,
  };
  return <ReactNative.Text style={style} {...otherProps} />;
}
