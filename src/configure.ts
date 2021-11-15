import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import {Colors, Typography} from "react-native-ui-lib";

export async function prepare(callbackHook: () => void) {
  try {
    // Keep the splash screen visible while we fetch resources
    await SplashScreen.preventAutoHideAsync().catch(() => {});

    // Pre-load fonts, make any API calls you need to do here
    await Font.loadAsync('MillerText', require('../assets/fonts/Miller-Text.ttf'))

    await Colors.loadColors({
      skyblue: '#E8F0F7',
    });

    await Typography.loadTypographies({
      millerText18: {
        fontFamily: 'MillerText',
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 28,
        fontStyle: 'normal'
      },
    });
  } catch (e) {
    console.warn(e);
  } finally {
    callbackHook();
  }
}