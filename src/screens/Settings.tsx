import tw from "../tailwind";
import ReactNative from "react-native";
import { SettingsProps } from "../navigation/types";
import React from "react";
import Heading from "../components/text/Heading";

export default function Settings({ route, navigation }: SettingsProps) {
  const { code, users } = route.params;

  return (
    <ReactNative.View style={tw.style("flex-1", "bg-white")}>
      <Heading>{code.toString()}</Heading>
    </ReactNative.View>
  );
}
