import ReactNative from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import tw from "../../tailwind";
import Marker from "../Marker";
import Emoji from "../emojis/Emoji";

export type PressedInfo = {
  emojiCode: string;
};

export type KeyProps = ReactNative.ViewProps & {
  width: number;
  height: number;
  depth?: number;
  pressed?: PressedInfo | null;
  borderRadius?: number;
  borderWidth?: number;
  foregroundTopColor: string;
  foregroundBottomColor: string;
  sideColor: string;
  borderColor: string;
  pressedColor: string;
};

export default function Key({
  width,
  height,
  depth = 10,
  pressed = null,
  borderRadius = 15,
  borderWidth = 5,
  foregroundTopColor,
  foregroundBottomColor,
  sideColor,
  borderColor,
  pressedColor,
  style,
  ...otherProps
}: KeyProps) {
  return (
    <ReactNative.View
      style={[
        style,
        {
          width: width + 2 * borderWidth,
          height: height + 2 * borderWidth,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
          backgroundColor: pressed ? pressedColor : sideColor,
          borderWidth: borderWidth,
          borderColor: borderColor,
        },
      ]}
      {...otherProps}
    >
      {pressed ? (
        <ReactNative.View
          style={tw.style("flex-1", "items-center", "justify-end")}
        >
          <Marker size={0.5 * width} style={{ margin: 0.25 * width }}>
            <Emoji id={pressed.emojiCode} size={0.3 * width} />
          </Marker>
        </ReactNative.View>
      ) : (
        <LinearGradient
          colors={[foregroundTopColor, foregroundBottomColor]}
          style={{
            width: width,
            height: height - depth,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
          }}
        />
      )}
    </ReactNative.View>
  );
}
