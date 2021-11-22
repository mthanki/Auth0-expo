import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { User } from "../types";

export type RootStackParamList = {
	Landing: undefined,
    Home: {
        token: String | null,
        user: User,
        onLogout: () => void,
    }
    Payment: undefined,
}

export const Stack = createNativeStackNavigator<RootStackParamList>();

