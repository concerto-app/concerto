import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useDeviceContext } from "twrnc";
import tw from "./src/tailwind";

export default function App() {
  useDeviceContext(tw);
  return (
    <View
      style={tw.style("flex-1", "bg-white", "items-center", "justify-center")}
    >
      <Text>Hello World?</Text>
      <StatusBar style="auto" />
    </View>
  );
}
