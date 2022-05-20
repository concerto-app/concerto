import "expo-dev-client";
import { useDeviceContext } from "twrnc";
import tw from "./src/tailwind";
import Main from "./src/screens/Main";
import {
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { NavigationContainer } from "@react-navigation/native";
import Stack from "./src/navigation/Stack";
import Play from "./src/screens/Play";
import Settings from "./src/screens/Settings";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { SettingsProvider } from "./src/contexts/settings";
import { Provider } from "react-redux";
import { store } from "./src/state/store";
import { MidiProvider } from "./src/contexts/midi";
import { RoomProvider } from "./src/contexts/room";
import { PlayerProvider } from "./src/contexts/player";
import { LogBox } from "react-native";
import Constants from "expo-constants";

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

const serverUrl = Constants.manifest?.extra?.serverUrl;

function configureLogging() {
  LogBox.ignoreLogs([
    "`new NativeEventEmitter()`",
    "EventEmitter.removeListener",
  ]);
}

const mainScreen = gestureHandlerRootHOC(Main);
const playScreen = gestureHandlerRootHOC(Play);
const settingsScreen = gestureHandlerRootHOC(Settings);

export default function App() {
  useDeviceContext(tw);

  const [fontsLoaded] = useFonts(fonts);

  const onLayoutReady = React.useCallback(
    async () => await SplashScreen.hideAsync(),
    []
  );

  React.useEffect(() => {
    SplashScreen.preventAutoHideAsync().then();
    configureLogging();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer onReady={onLayoutReady}>
      <Provider store={store}>
        <SettingsProvider>
          <MidiProvider>
            <RoomProvider url={serverUrl}>
              <PlayerProvider>
                <Stack.Navigator
                  initialRouteName="main"
                  screenOptions={{
                    headerShown: false,
                    statusBarHidden: true,
                  }}
                >
                  <Stack.Screen
                    name="main"
                    component={mainScreen}
                    initialParams={{ availableEmojiCodes: availableEmojiCodes }}
                    options={{ orientation: "default" }}
                  />
                  <Stack.Screen
                    name="play"
                    component={playScreen}
                    options={{ orientation: "landscape" }}
                  />
                  <Stack.Screen
                    name="settings"
                    component={settingsScreen}
                    options={{ orientation: "default" }}
                  />
                </Stack.Navigator>
              </PlayerProvider>
            </RoomProvider>
          </MidiProvider>
        </SettingsProvider>
      </Provider>
    </NavigationContainer>
  );
}
