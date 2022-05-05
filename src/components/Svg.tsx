import {
  Canvas,
  Group,
  ImageSVG,
  Offset,
  Paint,
  RectCtor,
  SkSVG,
  usePaintRef,
} from "@shopify/react-native-skia";
import React from "react";
import ReactNative from "react-native";
import tw from "../tailwind";

export type SvgProps = Omit<RectCtor, "x" | "y"> &
  React.PropsWithChildren<{
    x?: number;
    y?: number;
    svg?: SkSVG | null;
    canvasScale?: number;
  }>;

const defaultProps = {
  x: 0,
  y: 0,
};

export default function Svg({
  svg,
  width,
  height,
  canvasScale = 3,
  children,
  ...otherProps
}: SvgProps) {
  const props = {
    ...defaultProps,
    width: width,
    height: height,
    ...otherProps,
  };
  const paint = usePaintRef();
  const [canvasWidth, canvasHeight] = [
    canvasScale * width,
    canvasScale * height,
  ];
  const [offsetX, offsetY] = [
    0.5 * canvasWidth - 0.5 * width,
    0.5 * canvasHeight - 0.5 * height,
  ];
  return (
    <ReactNative.View style={{ width: width, height: height }}>
      <Canvas
        style={tw.style("absolute", {
          left: -offsetX,
          top: -offsetY,
          width: canvasWidth,
          height: canvasHeight,
        })}
      >
        <Paint ref={paint}>
          {children}
          <Offset x={offsetX} y={offsetY} />
        </Paint>
        <Group layer={paint}>{svg && <ImageSVG svg={svg} {...props} />}</Group>
      </Canvas>
    </ReactNative.View>
  );
}
