import tw from "../tailwind";
import ReactNative from "react-native";
import Heading from "../components/Heading";
import { PlayProps } from "../navigation/types";
import { useEffect } from "react";
import { changeScreenOrientation, Orientation } from "../utils";

export default function Play({ route, navigation }: PlayProps) {
  const { code } = route.params;

  useEffect(() => {
    changeScreenOrientation(Orientation.LANDSCAPE).then().catch(console.log);
  });

  return (
    <ReactNative.View
      style={tw.style("flex-1", "bg-white", "items-center", "justify-center")}
    >
      <Heading>{code.toString()}</Heading>
    </ReactNative.View>
  );
}
