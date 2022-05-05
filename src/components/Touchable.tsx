import { TouchableOpacity } from "react-native-gesture-handler";
import React from "react";

export type TouchableProps = React.ComponentProps<typeof TouchableOpacity> & {
  canvasSize?: number;
};

export default function Touchable({
  canvasSize = 3,
  style,
  containerStyle,
  ...otherProps
}: TouchableProps) {
  return (
    <TouchableOpacity
      style={[
        style,
        {
          left: `-${50 * (canvasSize - 1)}%`,
          top: `-${50 * (canvasSize - 1)}%`,
          width: `${canvasSize * 100}%`,
          height: `${canvasSize * 100}%`,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
      containerStyle={[containerStyle, { position: "absolute" }]}
      extraButtonProps={{
        rippleColor: "#00000000",
        exclusive: false,
      }}
      {...otherProps}
    />
  );
}
