import tw from "../tailwind";
import Slot from "./Slot";
import Emoji from "./Emoji";
import ReactNative from "react-native";

export type EmojiCodeProps = {
  codes: Array<string | null>;
  size?: number;
  margin?: number;
};

export default function EmojiCode({
  codes,
  size = 50,
  margin = 12,
}: EmojiCodeProps) {
  return (
    <ReactNative.View style={tw.style("flex-row")}>
      {codes.map((code, index) => (
        <Slot key={index} style={tw.style(`m-[${margin}]`)}>
          {code !== null ? (
            <Emoji code={code} size={size} />
          ) : (
            <ReactNative.View style={{ width: size, height: size }} />
          )}
        </Slot>
      ))}
    </ReactNative.View>
  );
}
