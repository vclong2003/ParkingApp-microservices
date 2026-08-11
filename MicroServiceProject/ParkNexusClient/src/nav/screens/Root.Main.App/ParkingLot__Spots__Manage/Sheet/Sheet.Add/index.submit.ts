import {trpc, TrpcInput} from "@src/trpc";
import {parseTrpcErrorMessage} from "@src/utils/trpcHelpers";
import Toast from "react-native-toast-message";

export type TAddParkingLotSpotPayload = TrpcInput["parking"]["lot"]["spot"]["add"];
export function useSubmit() {
    const mutation = trpc.parking.lot.spot.add.useMutation();

    const ctx = trpc.useUtils();
    const submit = (data: TAddParkingLotSpotPayload, onSuccess?: () => void) => {
        mutation.mutateAsync(data, {
            async onSuccess() {
                await ctx.parking.lot.get.single.invalidate();
                onSuccess?.();
            },
            onError(err) {
                console.error(err);
                Toast.show({
                    type: "error",
                    text1: parseTrpcErrorMessage(err.message),
                });
            },
        });
    };

    return Object.assign({submit}, mutation);
}
