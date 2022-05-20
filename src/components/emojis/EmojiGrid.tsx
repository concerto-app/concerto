import Grid from "../Grid";
import ReactNative from "react-native";
import EmojiSymbol from "./EmojiSymbol";
import { BorderlessButton, ScrollView } from "react-native-gesture-handler";
import React from "react";

export type EmojiGridProps = ReactNative.ViewProps & {
  emojiIds: Array<string>;
  horizontal?: boolean;
  edgeMargin?: number;
  emojiMargin?: number;
  emojiSize?: number;
  emojiCanvasScale?: number;
  onEmojiSelected?: (emojiId: string) => void;
};

export default function EmojiGrid({
  emojiIds,
  horizontal = true,
  edgeMargin = 32,
  emojiMargin = 8,
  emojiSize = 40,
  emojiCanvasScale = 4,
  onEmojiSelected = () => {},
  style,
  ...props
}: EmojiGridProps) {
  return (
    <ScrollView
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
        {emojiIds.map((id, index) => (
          <ReactNative.View key={index}>
            <BorderlessButton onPress={() => onEmojiSelected(id)}>
              <ReactNative.View style={{ margin: emojiMargin }}>
                <EmojiSymbol id={id} size={emojiSize} />
              </ReactNative.View>
            </BorderlessButton>
          </ReactNative.View>
        ))}
      </Grid>
    </ScrollView>
  );
}
