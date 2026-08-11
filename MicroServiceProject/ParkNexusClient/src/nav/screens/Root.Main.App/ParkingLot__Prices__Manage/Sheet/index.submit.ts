import {trpc, TrpcInput} from "@src/trpc";
import {parseTrpcErrorMessage} from "@src/utils/trpcHelpers";
import Toast from "react-native-toast-message";

export type TUpdateParkingLotPricePayload = TrpcInput["parking"]["lot"]["price"]["update"];
export function useSubmitPrice() {
    const mutation = trpc.parking.lot.price.update.useMutation();

    const ctx = trpc.useUtils();
    const submitPrice = (payload: TUpdateParkingLotPricePayload, onSuccess?: () => void) => {
        mutation.mutate(payload, {
            async onSuccess() {
                await ctx.parking.lot.get.single.invalidate();
                onSuccess?.();
            },
            onError(error) {
                Toast.show({
                    type: "error",
                    text1: parseTrpcErrorMessage(error.message),
                });
            },
        });
    };

    return Object.assign({submitPrice}, mutation);
}
