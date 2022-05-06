import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";
import Icon from "./Icon";
import { TextStyle } from "react-native";
import React from "react";

export type PickerProps = Omit<
  PickerSelectProps,
  "onValueChange" | "useNativeAndroidPickerStyle" | "style"
> & {
  height?: number;
  style?: TextStyle;
  iconName?: React.ComponentProps<typeof Icon>["name"];
  onValueChange?: (value: any, index: number) => void;
};

export default function Picker({
  height = 30,
  style: propStyle = {},
  iconName = "md-caret-down",
  onValueChange = () => {},
  ...otherProps
}: PickerProps) {
  const style = {
    fontFamily: "Nunito_700Bold",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 5,
    color: "#252525",
    ...propStyle,
    height: height,
    fontSize: 0.5 * height,
    paddingLeft: 0.25 * height,
    paddingRight: height,
  };

  return (
    <RNPickerSelect
      style={{
        inputAndroid: style,
        inputIOS: style,
        iconContainer: {
          height: style.height,
          width: style.height,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
      useNativeAndroidPickerStyle={false}
      onValueChange={onValueChange}
      Icon={() => (
        <Icon
          size={0.5 * style.height}
          name={iconName}
          color={style.borderColor}
        />
      )}
      {...otherProps}
    />
  );
}
