import React from "react";
import ReactNative from "react-native";

export type GridProps = ReactNative.ViewProps & {
  horizontal?: boolean;
};

export default function Grid({
  horizontal = true,
  style: propStyle = {},
  ...otherProps
}: GridProps) {
  return (
    <ReactNative.View
      style={[
        propStyle,
        {
          flex: 1,
          flexWrap: "wrap",
          justifyContent: "center",
          flexDirection: horizontal ? "column" : "row",
        },
      ]}
      {...otherProps}
    />
  );
}
