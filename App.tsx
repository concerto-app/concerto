import "expo-dev-client";
import { useDeviceContext } from "twrnc";
import tw from "./src/tailwind";
import Main from "./src/screens/Main";
import { useFonts } from "@expo-google-fonts/nunito";
import { NavigationContainer } from "@react-navigation/native";
import Stack from "./src/navigation/Stack";
import Play from "./src/screens/Play";
import Settings from "./src/screens/Settings";
import Error from "./src/screens/Error";
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
import { fonts, iceServers, urls } from "./src/constants";

LogBox.ignoreLogs([
  "`new NativeEventEmitter()`",
  "EventEmitter.removeListener",
]);

const mainScreen = gestureHandlerRootHOC(Main);
const playScreen = gestureHandlerRootHOC(Play);
const settingsScreen = gestureHandlerRootHOC(Settings);
const errorScreen = gestureHandlerRootHOC(Error);

export default function App() {
  useDeviceContext(tw);

  const [fontsLoaded] = useFonts(fonts);

  const onLayoutReady = React.useCallback(
    async () => await SplashScreen.hideAsync(),
    []
  );

  React.useEffect(() => {
    SplashScreen.preventAutoHideAsync().then();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer onReady={onLayoutReady}>
      <Provider store={store}>
        <SettingsProvider>
          <MidiProvider>
            <RoomProvider url={urls.connect} iceServers={iceServers}>
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
                  <Stack.Screen
                    name="error"
                    component={errorScreen}
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
