import { ErrorProps } from "../navigation/types";
import ReactNative from "react-native";
import tw from "../tailwind";
import Heading from "../components/text/Heading";
import RegularText from "../components/text/RegularText";
import React from "react";

export default function Main({ route, navigation }: ErrorProps) {
  const { message } = route.params;

  React.useEffect(() => {
    const beforeRemove = (e: { preventDefault: () => void }) => {
      e.preventDefault();
      navigation.removeListener("beforeRemove", beforeRemove);
      navigation.reset({
        index: 0,
        routes: [{ name: "main" }],
      });
    };
    navigation.addListener("beforeRemove", beforeRemove);
    return () => navigation.removeListener("beforeRemove", beforeRemove);
  }, [navigation]);

  return (
    <ReactNative.View
      style={tw.style("flex-1", "items-center", "justify-center", "bg-white")}
    >
      <Heading>Error</Heading>
      <RegularText>{message}</RegularText>
    </ReactNative.View>
  );
}
