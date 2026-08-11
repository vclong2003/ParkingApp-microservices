import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthTypes} from "./index.types";
import {trpc, TrpcInput} from "@src/trpc";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {useAuthStore} from "@src/states";
import {OneSignal} from "react-native-onesignal";
import Toast from "react-native-toast-message";
import {parseTrpcErrorMessage} from "@src/utils/trpcHelpers";

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

type TGoogleLoginPayload = TrpcInput["auth"]["login"]["google"];
export function useGoogleSignIn() {
    const googleLoginMutation = trpc.auth.login.google.useMutation();

    const {setIsAuthenticated} = useAuthStore();
    const ctx = trpc.useUtils();

    const onSignIn = (payload: TGoogleLoginPayload) => {
        googleLoginMutation.mutate(payload, {
            onSuccess(data) {
                AuthStorage.setAccessToken(data.accessToken);
                AuthStorage.setRefreshToken(data.refreshToken);
                OneSignal.login(data.accountId);
                ctx.user.profile.invalidate();
                setIsAuthenticated(true);
            },
            onError(err) {
                console.error(err.message);
                Toast.show({
                    type: "error",
                    text1: parseTrpcErrorMessage(err.message),
                });
            },
        });
    };

    const signInWithGoogle = () => {
        GoogleSignin.signIn()
            .then(res => {
                const idToken = res.data?.idToken;
                if (idToken) onSignIn({idToken});
            })
            .catch(err => {
                console.log(err);
                Toast.show({
                    type: "error",
                    text1: "Something went wrong, please try again later",
                });
            });
    };

    return {signInWithGoogle};
}
