import tw from "../tailwind";
import ReactNative from "react-native";
import { SettingsProps } from "../navigation/types";
import React, { useEffect } from "react";
import Heading from "../components/text/Heading";
import { changeScreenOrientation, Orientation } from "../utils";

export default function Settings({ route, navigation }: SettingsProps) {
  const { code, users } = route.params;

  useEffect(() => {
    navigation.addListener("focus", () => {
      changeScreenOrientation(Orientation.DEFAULT).then().catch(console.log);
    });
  }, [navigation]);

  return (
    <ReactNative.View style={tw.style("flex-1", "bg-white")}>
      <ReactNative.View style={tw.style("m-4")}>
        <Heading>{code.toString()}</Heading>
      </ReactNative.View>
    </ReactNative.View>
  );
}
