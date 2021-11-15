import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { User } from "../types";

export type RootStackParamList = {
	Landing: undefined,
    HomeScreen: {
        token: String | null,
        user: User,
        onLogout: () => void,
    }
}

export const Stack = createNativeStackNavigator<RootStackParamList>();