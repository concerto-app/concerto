import { Slider as LibSlider } from "@miblanchard/react-native-slider";
import { SliderProps as LibSliderProps } from "@miblanchard/react-native-slider/lib/types";
import Marker from "./Marker";
import React from "react";
import ReactNative, { Animated, Easing } from "react-native";
import Heading from "./text/Heading";
import tw from "../tailwind";

export type SliderProps = Omit<
  LibSliderProps,
  "animationType" | "value" | "renderAboveThumbComponent"
> & {
  value: number;
  animationType?: "spring" | "timing";
  renderAboveThumbComponent?: (
    value: number,
    opacity: Animated.Value
  ) => React.ReactNode;
  thumbSize?: number;
  tooltipPadding?: number;
  tooltipFontSize?: number;
  tooltipOpacity?: number;
  valueFormatter?: (value: number) => string;
};

function Tooltip({
  value,
  opacity,
  formatter,
  padding,
  fontSize,
}: {
  value: number;
  opacity: Animated.Value;
  formatter: (value: number) => string;
  padding: number;
  fontSize: number;
}) {
  return (
    <ReactNative.View style={{ marginLeft: 10 }}>
      <Animated.View
        style={[
          tw.style("rounded", "bg-white", "shadow-xl"),
          {
            padding: padding,
            left: "-50%",
            opacity: opacity,
          },
        ]}
      >
        <Heading style={{ fontSize: fontSize, marginBottom: 0 }}>
          {formatter(value)}
        </Heading>
      </Animated.View>
    </ReactNative.View>
  );
}

export default function Slider({
  value,
  step,
  onValueChange,
  onSlidingStart,
  onSlidingComplete,
  animationType = "spring",
  thumbSize = 20,
  tooltipPadding = 5,
  tooltipFontSize = 20,
  tooltipOpacity = 0.8,
  valueFormatter = Number.isInteger(step)
    ? (value) => value.toString()
    : (value) => value.toFixed(3),
  renderAboveThumbComponent = (value, opacity) => (
    <Tooltip
      value={value}
      opacity={opacity}
      formatter={valueFormatter}
      padding={tooltipPadding}
      fontSize={tooltipFontSize}
    />
  ),
  renderThumbComponent = () => <Marker size={thumbSize} />,
  minimumTrackTintColor = "#dc2626",
  maximumTrackTintColor = "#dcdcdc",
  ...otherProps
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(value);
  const opacityAnimated = React.useRef(new Animated.Value(0)).current;

  return (
    <LibSlider
      value={internalValue}
      step={step}
      animationType={animationType}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor={maximumTrackTintColor}
      renderThumbComponent={renderThumbComponent}
      renderAboveThumbComponent={() =>
        renderAboveThumbComponent(internalValue, opacityAnimated)
      }
      onValueChange={(value) => {
        setInternalValue(Array.isArray(value) ? value[0] : value);
        onValueChange && onValueChange(value);
      }}
      onSlidingStart={(value) => {
        opacityAnimated.setValue(tooltipOpacity);
        onSlidingStart && onSlidingStart(value);
      }}
      onSlidingComplete={(value) => {
        Animated.timing(opacityAnimated, {
          toValue: 0,
          easing: Easing.ease,
          duration: 200,
          useNativeDriver: true,
        }).start();
        onSlidingComplete && onSlidingComplete(value);
      }}
      {...otherProps}
    />
  );
}
