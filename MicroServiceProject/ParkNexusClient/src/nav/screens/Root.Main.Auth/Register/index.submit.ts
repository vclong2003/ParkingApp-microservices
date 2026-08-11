import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AuthStackParamList} from "@src/nav/navigators/Root.Main.Auth";
import {trpc, TrpcInput} from "@src/trpc";
import {parseTrpcErrorMessage} from "@src/utils/trpcHelpers";
import Toast from "react-native-toast-message";

export type TRegisterPayload = TrpcInput["auth"]["register"]["user"];
export function useSubmit(onSuccess: () => void) {
    const mutation = trpc.auth.register.user.useMutation();

    const submit = (payload: TRegisterPayload) => {
        mutation.mutate(payload, {
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

    return Object.assign(mutation, {submit});
}

export type TVerifyPayload = TrpcInput["auth"]["register"]["verify"];
export function useVerify() {
    const verifyMutation = trpc.auth.register.verify.useMutation();

    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const verify = (payload: TVerifyPayload) => {
        verifyMutation.mutate(payload, {
            onSuccess() {
                Toast.show({
                    type: "success",
                    text1: "Registered successfully, you can now login",
                });
                navigation.navigate("Login");
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
