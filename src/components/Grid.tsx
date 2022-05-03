import React from "react";
import ReactNative from "react-native";
import tw from "../tailwind";

export type GridProps = ReactNative.ViewProps & {
  horizontal?: boolean;
};

export default function Grid({
  horizontal = true,
  style: propStyle = {},
  ...otherProps
}: GridProps) {
  const style = [
    propStyle,
    tw.style(
      "flex",
      "flex-wrap",
      "justify-center",
      horizontal ? "flex-col" : "flex-row"
    ),
  ];
  return <ReactNative.View style={style} {...otherProps} />;
}
