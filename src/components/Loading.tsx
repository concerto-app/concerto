import ReactNative from "react-native";
import tw from "../tailwind";
import Heading from "./text/Heading";

export type LoadingProps = ReactNative.ViewProps;

export default function Loading(props: LoadingProps) {
  return (
    <ReactNative.View
      style={tw.style("flex-1", "items-center", "justify-center", "bg-white")}
    >
      <ReactNative.ActivityIndicator size="large" />
      <ReactNative.View style={{ margin: 10 }} />
      <Heading>Loading...</Heading>
    </ReactNative.View>
  );
}
