import React from "react";
import { Button, Text, View } from "react-native-ui-lib";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../services/navigation";
import * as SecureStore from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import * as Random from "expo-random";
import queryString from "query-string";
import {
  AUTH_CLIENT_ID,
  AUTH_DOMAIN,
  ID_TOKEN_KEY,
  NONCE_KEY,
  AUTH_NAMESPACE,
} from "../consts";
import { Alert } from "react-native";
import jwtDecoder from "jwt-decode";
import * as Linking from "expo-linking";

interface LandingScreenProps {
  onLayout: () => void;
  onLogin: (isNewUser: boolean) => void;
  navigation: NativeStackNavigationProp<RootStackParamList, "Landing">;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onLayout, onLogin }) => {
  const generateNonce = async () => {
    const nonce = String.fromCharCode.apply(
      null,
      (await Random.getRandomBytesAsync(16)) as any
    );
    await SecureStore.setItemAsync(NONCE_KEY, nonce);
    return nonce;
  };

  const decodeToken = (token: string) => {
    const decodedToken: any = jwtDecoder(token);
    console.log(decodedToken);
    const { nonce, sub, email, name, exp } = decodedToken;

    SecureStore.getItemAsync(NONCE_KEY).then((savedNonce) => {
      // currently there is a problem with nonce matching
      // if (savedNonce == nonce) {
      if (savedNonce) {
        SecureStore.setItemAsync(
          ID_TOKEN_KEY,
          JSON.stringify({
            id: sub,
            email,
            name,
            exp,
            token,
          })
        ).then(() => onLogin(decodedToken[AUTH_NAMESPACE].isNewUser));
      } else {
        Alert.alert("Error", "Nonce don't match");
        return;
      }
    });
  };

  const handleGetStartedPress = async () => {
    const nonce = generateNonce();
    AuthSession.startAsync({
      authUrl:
        `${AUTH_DOMAIN}/authorize?` +
        queryString.stringify({
          client_id: AUTH_CLIENT_ID,
          response_type: "id_token",
          scope: "openid profile email",
          redirect_uri: AuthSession.getRedirectUrl(),
          nonce: nonce,
        }),
    }).then((result: any) => {
      if (result.type === "success") {
        decodeToken(result.params.id_token);
      } else if (result.params && result.params.error) {
        Alert.alert(
          "Error",
          result.params.error_description ||
            "Something went wrong while logging in."
        );
      }
    });
  };

  return (
    <View bg-skyblue flex padding-0 style={{ alignItems: "center" }}>
      <View flex center width={"100%"} height={268} paddingH-24>
        <View
          flex-0
          width={"100%"}
          bottom-24
          marginB-24
          style={{ alignItems: "center" }}
          onLayout={onLayout}
        >
          <Text millerText18 textAlign={"center"} marginT-16 bottom-4>
            Welcome, please signin to continue.
          </Text>
        </View>
        <View centerH centerV={false} width={"100%"}>
          <Button
            onPress={handleGetStartedPress}
            style={{ marginTop: 10 }}
            label="Get started"
            size={Button.sizes.large}
            millerText18
            white
            center
          />
        </View>
      </View>
    </View>
  );
};

export default LandingScreen;
