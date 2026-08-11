import {trpc, TrpcInput} from "@src/trpc";

export type TAddParkingLotServicePayload = TrpcInput["parking"]["lot"]["service"]["add"];
export function useSubmit() {
    const mutation = trpc.parking.lot.service.add.useMutation();

    const ctx = trpc.useUtils();
    const submit = (payload: TAddParkingLotServicePayload, onSuccess?: () => void) => {
        mutation.mutate(payload, {
            async onSuccess() {
                await ctx.parking.lot.get.single.invalidate();
                onSuccess?.();
            },
        });
    };

    return Object.assign({submit}, mutation);
}
