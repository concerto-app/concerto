import ReactNative from "react-native";
import tw from "../tailwind";
import Heading from "./text/Heading";

export type IndicatorProps = Omit<ReactNative.ViewProps, "children"> & {
  size: number;
  text: string;
  color?: string;
};

export default function Indicator({
  size,
  text,
  color = "#dc2626",
  style,
  ...otherProps
}: IndicatorProps) {
  return (
    <ReactNative.View
      style={[
        style,
        tw.style("items-center", "justify-center", "rounded-full"),
        {
          width: size,
          height: size,
          backgroundColor: color,
        },
      ]}
      {...otherProps}
    >
      <Heading
        numberOfLines={1}
        style={tw.style("text-white", {
          fontSize: (size * 2) / 3,
          marginBottom: 0,
          lineHeight: size,
        })}
      >
        {text}
      </Heading>
    </ReactNative.View>
  );
}
