import ReactNative from "react-native";
import tw from "../tailwind";

export type SlotProps = ReactNative.ViewProps;

const overrideStyle = tw.style("bg-white", "rounded", "shadow-xl", "p-4");

export default function Slot({ style: propStyle, ...otherProps }: SlotProps) {
  return (
    <ReactNative.View style={[propStyle, overrideStyle]} {...otherProps} />
  );
}
