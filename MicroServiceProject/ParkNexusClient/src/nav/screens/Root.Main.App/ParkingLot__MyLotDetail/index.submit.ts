import {trpc, TrpcInput} from "@src/trpc";

export type TUpdateParkingLotPayload = TrpcInput["parking"]["lot"]["update"];
export function useUpdateParkingLot() {
    const mutation = trpc.parking.lot.update.useMutation();

    const ctx = trpc.useUtils();
    const updateParkingLot = (payload: TUpdateParkingLotPayload) => {
        mutation.mutate(payload, {
            onSuccess() {
                ctx.parking.lot.get.single.invalidate();
            },
        });
    };

    return Object.assign({updateParkingLot}, mutation);
}
