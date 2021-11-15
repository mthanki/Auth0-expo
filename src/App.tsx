import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import LandingScreen from "./screens/LandingScreen";
import { Stack } from "./services/navigation";
import * as SplashScreen from "expo-splash-screen";
import delayAsync from "delay-async";
import { prepare } from "./configure";
import * as SecureStore from "expo-secure-store";
import { ID_TOKEN_KEY } from "./consts";
import { User } from "./types";
import HomeScreen from "./screens/HomeScreen";
import { Button } from "react-native-ui-lib";
import * as Linking from "expo-linking";

export default function App() {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [token, setToken] = useState<String | null>(null);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    prepare(() => {
      setAppIsReady(true);
    });

    return () => {
      // cleanup
    };
  }, []);

  const handleLogin = (isNewUser: boolean = false) => {
    SecureStore.getItemAsync(ID_TOKEN_KEY).then((session) => {
      if (session) {
        const sessionObj = JSON.parse(session);
        const { token, exp, id, name } = sessionObj;
        if (exp > Math.floor(new Date().getTime() / 1000)) {
          setToken(token);
          setUser({ id, name, isNewUser });
        } else {
          handleLogout();
        }
      }
    });
  };

  const handleLogout = () => {
    SecureStore.deleteItemAsync(ID_TOKEN_KEY);
    setToken(null);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.

      console.log(`onLayoutRootView: ${new Date().toUTCString()}`);
      await delayAsync(2500);

      console.log(`Hiding splashscreen: ${new Date().toUTCString()}`);
      await SplashScreen.hideAsync();

      handleLogin();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const prefix = Linking.createURL("/https");

  const linking = {
    prefixes: [prefix],
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {token && user ? (
          <>
            <Stack.Screen
              name={"HomeScreen"}
              options={{
                title: `${user.name}'s Todos`,
                headerRight: () => (
                  <Button
                    onPress={handleLogout}
                    label="logout"
                    backgroundColor="lightgray"
                  />
                ),
              }}
            >
              {(props) => (
                <HomeScreen
                  onLogout={handleLogout}
                  token={token}
                  user={user}
                  {...props}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name={"Landing"} options={{ headerShown: false }}>
              {(props) => (
                <LandingScreen
                  onLogin={handleLogin}
                  onLayout={onLayoutRootView}
                  {...props}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
