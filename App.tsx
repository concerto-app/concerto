import "expo-dev-client";
import { useDeviceContext } from "twrnc";
import tw from "./src/tailwind";
import Main from "./src/screens/Main";
import {
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import Stack from "./src/navigation/Stack";
import Play from "./src/screens/Play";
import Settings from "./src/screens/Settings";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const fonts = {
  Nunito_700Bold,
  Nunito_800ExtraBold,
};

const availableEmojiCodes = [
  "1f349",
  "1f34b",
  "1f34c",
  "1f34d",
  "1f34e",
  "1f351",
  "1f352",
  "1f353",
  "1f95d",
  "1f345",
  "1f965",
  "1f955",
  "1f33d",
  "1f336",
  "1f966",
  "1f344",
  "1f9c0",
  "1f354",
  "1f35f",
  "1f355",
  "1f32d",
];

export default function App() {
  useDeviceContext(tw);

  const [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) return <AppLoading />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="main"
        screenOptions={{
          headerShown: false,
          statusBarHidden: true,
        }}
      >
        <Stack.Screen
          name="main"
          component={gestureHandlerRootHOC(Main)}
          initialParams={{ availableEmojiCodes: availableEmojiCodes }}
          options={{ orientation: "default" }}
        />
        <Stack.Screen
          name="play"
          component={gestureHandlerRootHOC(Play)}
          options={{ orientation: "landscape" }}
        />
        <Stack.Screen
          name="settings"
          component={gestureHandlerRootHOC(Settings)}
          options={{ orientation: "default" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
