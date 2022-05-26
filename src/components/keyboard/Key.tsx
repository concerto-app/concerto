import ReactNative from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Marker from "../Marker";
import Emoji from "../emojis/Emoji";
import React from "react";
import equal from "fast-deep-equal/react";

export type PressedInfo = {
  emojiId: string;
};

export type KeyProps = ReactNative.ViewProps & {
  width: number;
  height: number;
  depth?: number;
  pressed?: PressedInfo;
  borderRadius?: number;
  borderWidth?: number;
  foregroundTopColor: string;
  foregroundBottomColor: string;
  sideColor: string;
  borderColor: string;
  pressedColor: string;
};

const ReleasedForeground = (props: {
  topColor: string;
  bottomColor: string;
  width: number;
  height: number;
  radius: number;
}) => {
  return (
    <LinearGradient
      colors={[props.topColor, props.bottomColor]}
      style={{
        width: props.width,
        height: props.height,
        borderBottomLeftRadius: props.radius,
        borderBottomRightRadius: props.radius,
      }}
    />
  );
};

const PressedForeground = (props: { width: number; emojiId?: string }) => {
  const [previousEmoji, setPreviousEmoji] = React.useState<string>();

  React.useEffect(() => {
    if (props.emojiId) setPreviousEmoji(props.emojiId);
  }, [props.emojiId]);

  return (
    <ReactNative.View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Marker size={0.5 * props.width} style={{ margin: 0.25 * props.width }}>
        {!previousEmoji ? null : (
          <Emoji id={previousEmoji} size={0.3 * props.width} />
        )}
      </Marker>
    </ReactNative.View>
  );
};

const MemoizedReleasedForeground = React.memo(ReleasedForeground, equal);
const MemoizedPressedForeground = React.memo(PressedForeground, equal);

export default function Key({
  width,
  height,
  depth = 10,
  pressed,
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
  const opacityAnimation = React.useRef(
    new ReactNative.Animated.Value(0.0)
  ).current;

  React.useEffect(() => {
    opacityAnimation.stopAnimation();

    if (pressed === undefined) {
      const timing = ReactNative.Animated.timing(opacityAnimation, {
        toValue: 0.0,
        duration: 100,
        useNativeDriver: true,
      });

      timing.start();
      return () => timing.stop();
    } else {
      opacityAnimation.setValue(1.0);
    }
  }, [JSON.stringify(pressed)]);

  return (
    <ReactNative.View
      style={[
        style,
        {
          width: width + 2 * borderWidth,
          height: height + 2 * borderWidth,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
          backgroundColor: sideColor,
          borderWidth: borderWidth,
          borderColor: borderColor,
          overflow: "hidden",
        },
      ]}
      {...otherProps}
    >
      <ReactNative.View
        style={{
          width: width,
          height: height,
          position: "absolute",
          display: "flex",
        }}
      >
        <MemoizedReleasedForeground
          topColor={foregroundTopColor}
          bottomColor={foregroundBottomColor}
          width={width}
          height={height - depth}
          radius={borderRadius}
        />
      </ReactNative.View>
      <ReactNative.Animated.View
        style={{
          width: width,
          height: height,
          position: "absolute",
          display: "flex",
          backgroundColor: pressedColor,
          opacity: opacityAnimation,
        }}
      >
        <MemoizedPressedForeground width={width} emojiId={pressed?.emojiId} />
      </ReactNative.Animated.View>
    </ReactNative.View>
  );
}
