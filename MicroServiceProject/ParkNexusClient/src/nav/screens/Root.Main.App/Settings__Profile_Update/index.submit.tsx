import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {trpc, TrpcInput} from "@src/trpc";
import {parseTrpcErrorMessage} from "@src/utils/trpcHelpers";
import Toast from "react-native-toast-message";

export type TUpdateProfilePayload = TrpcInput["user"]["profile"]["update"];
export function useSubmit() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const mutation = trpc.user.profile.update.useMutation();
    const ctx = trpc.useUtils();

    const submit = (payload: TUpdateProfilePayload) => {
        mutation.mutate(payload, {
            async onSuccess() {
                await ctx.user.profile.get.single.invalidate(undefined, {
                    exact: true,
                    queryKey: ["settings_screen"],
                });
                navigation.goBack();
            },
            onError(error) {
                Toast.show({
                    type: "error",
                    text1: parseTrpcErrorMessage(error.message),
                });
            },
        });
    };

    return Object.assign(mutation, {submit});
}
