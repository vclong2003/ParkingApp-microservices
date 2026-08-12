import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthTypes} from "./index.types";
import {GoogleSignin} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    iosClientId: AuthTypes.googleSignIn.iosClientId,
});

export namespace AuthStorage {
    export const getAccessToken = async (): Promise<string | null> => {
        return AsyncStorage.getItem(AuthTypes.ACCESS_TOKEN_STORAGE_KEY);
    };
    export const setAccessToken = async (accessToken: string) => {
        return AsyncStorage.setItem(AuthTypes.ACCESS_TOKEN_STORAGE_KEY, accessToken);
    };

    export const getRefreshToken = async (): Promise<string | null> => {
        return AsyncStorage.getItem(AuthTypes.REFRESH_TOKEN_STORAGE_KEY);
    };
    export const setRefreshToken = async (refreshToken: string) => {
        return AsyncStorage.setItem(AuthTypes.REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    };

    export const clearAuthStorage = async () => {
        await AsyncStorage.removeItem(AuthTypes.ACCESS_TOKEN_STORAGE_KEY);
        await AsyncStorage.removeItem(AuthTypes.REFRESH_TOKEN_STORAGE_KEY);
    };
}

export function useGoogleSignIn() {
    const signInWithGoogle = () => {};

    return {signInWithGoogle};
}
