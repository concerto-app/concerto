import ReactNative from "react-native";

export type RegularTextProps = Omit<ReactNative.TextProps, "style"> & {
  style?: Omit<ReactNative.TextStyle, "fontFamily">;
};

const defaultStyleProps = {
  marginBottom: 4,
  fontSize: 15,
};

const overrideStyleProps = {
  fontFamily: "Nunito_700Bold",
};

export default function RegularText({
  style: propStyle,
  ...otherProps
}: RegularTextProps) {
  const style: ReactNative.TextStyle = {
    ...defaultStyleProps,
    ...propStyle,
    ...overrideStyleProps,
  };
  return <ReactNative.Text style={style} {...otherProps} />;
}
