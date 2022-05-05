import tw from "../../tailwind";
import Slot from "../Slot";
import Emoji from "./Emoji";
import ReactNative from "react-native";

export type EmojiCodeProps = {
  code: Code;
  length: number;
  size?: number;
  margin?: number;
};

export default function EmojiCode({
  code,
  length,
  size = 50,
  margin = 12,
}: EmojiCodeProps) {
  const internalCode = [
    ...code,
    ...Array(Math.max(0, length - code.length)).fill(null),
  ];
  return (
    <ReactNative.View style={tw.style("flex-row")}>
      {internalCode.map((code, index) => (
        <Slot key={index} style={tw.style(`m-[${margin}]`)}>
          {code !== null ? (
            <Emoji id={code} size={size} />
          ) : (
            <ReactNative.View style={{ width: size, height: size }} />
          )}
        </Slot>
      ))}
    </ReactNative.View>
  );
}
