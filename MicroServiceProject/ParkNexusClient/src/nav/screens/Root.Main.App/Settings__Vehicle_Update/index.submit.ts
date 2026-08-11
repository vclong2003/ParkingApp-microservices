import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {trpc, TrpcInput} from "@src/trpc";

export type TUpdateVehiclePayload = TrpcInput["user"]["vehicle"]["update"];
export function useSubmit() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const mutation = trpc.user.vehicle.update.useMutation();

    const ctx = trpc.useUtils();
    const submit = (payload: TUpdateVehiclePayload) => {
        mutation.mutate(payload, {
            async onSuccess() {
                await ctx.user.vehicle.get.many.invalidate();
                navigation.navigate("Settings__Vehicle_List");
            },
        });
    };

    return Object.assign({submit}, mutation);
}
