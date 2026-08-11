import {AuthStorage} from "@src/auth/auth.utils";
import {useAuthStore} from "@src/states";
import {trpc, TrpcInput} from "@src/trpc";
import {parseTrpcErrorMessage} from "@src/utils/trpcHelpers";
import Toast from "react-native-toast-message";
import {OneSignal} from "react-native-onesignal";

export type TLoginPayload = TrpcInput["auth"]["login"]["user"];
export function useSubmit(onSuccess: () => void) {
    const submitMutation = trpc.auth.login.user.useMutation();

    const submit = (payload: TLoginPayload) => {
        submitMutation.mutate(payload, {
            onSuccess() {
                onSuccess();
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

    return Object.assign(submitMutation, {submit});
}

export type TVerifyPayload = TrpcInput["auth"]["login"]["verify"];
export function useVerify() {
    const verifyMutation = trpc.auth.login.verify.useMutation();

    const {setIsAuthenticated} = useAuthStore();
    const ctx = trpc.useUtils();

    const verify = (payload: TVerifyPayload) => {
        verifyMutation.mutate(payload, {
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

    return Object.assign(verifyMutation, {verify});
}
