import {NavigationProp, useNavigation} from "@react-navigation/native";
import {TabParamList} from "@src/nav/navigators/Root.Main.App.Tabs";
import {trpc, TrpcInput} from "@src/trpc";
import {parseTrpcErrorMessage} from "@src/utils/trpcHelpers";
import Toast from "react-native-toast-message";

export type TCreateParkingLotPayload = TrpcInput["parking"]["lot"]["submit"];

export function useSubmit() {
    const mutation = trpc.parking.lot.submit.useMutation();
    const navigation = useNavigation<NavigationProp<TabParamList>>();

    const ctx = trpc.useUtils();
    const submit = (payload: TCreateParkingLotPayload) => {
        mutation.mutate(payload, {
            onSuccess() {
                ctx.parking.lot.get.many.invalidate();
                navigation.navigate("Your Lots");
            },
            onError(error) {
                Toast.show({
                    type: "error",
                    text1: parseTrpcErrorMessage(error.message),
                });
            },
        });
    };

    return Object.assign({submit}, mutation);
}
