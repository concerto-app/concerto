import ReactNative from "react-native";
import tw from "../tailwind";

export type MarkerProps = ReactNative.ViewProps & {
  size?: string | number;
  padding?: string | number;
};

export default function Marker({
  size,
  padding = "10%",
  style,
  children,
  ...otherProps
}: MarkerProps) {
  return (
    <ReactNative.View
      style={[
        style,
        tw.style("rounded-full", "bg-white", "shadow-xl", {
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
        }),
      ]}
      {...otherProps}
    >
      <ReactNative.View style={{ padding: padding }} children={children} />
    </ReactNative.View>
  );
}
