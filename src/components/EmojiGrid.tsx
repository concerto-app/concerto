import Grid from "./Grid";
import ReactNative from "react-native";
import EmojiSymbol from "./EmojiSymbol";

export type EmojiGridProps = ReactNative.ViewProps & {
  emojiCodes: Array<string>;
  horizontal?: boolean;
  edgeMargin?: number;
  emojiMargin?: number;
  emojiSize?: number;
  onEmojiSelected?: (emojiCode: string) => void;
};

export default function EmojiGrid({
  emojiCodes,
  horizontal = true,
  edgeMargin = 32,
  emojiMargin = 8,
  emojiSize = 40,
  onEmojiSelected = () => {},
  style,
  ...props
}: EmojiGridProps) {
  return (
    <ReactNative.ScrollView
      horizontal={horizontal}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <Grid
        horizontal={horizontal}
        style={[
          style,
          { [horizontal ? "marginHorizontal" : "marginVertical"]: edgeMargin },
        ]}
        {...props}
      >
        {emojiCodes.map((code, index) => (
          <ReactNative.Pressable
            key={index}
            onPress={() => onEmojiSelected(code)}
          >
            <ReactNative.View style={{ margin: emojiMargin }}>
              <EmojiSymbol code={code} size={emojiSize} />
            </ReactNative.View>
          </ReactNative.Pressable>
        ))}
      </Grid>
    </ReactNative.ScrollView>
  );
}
