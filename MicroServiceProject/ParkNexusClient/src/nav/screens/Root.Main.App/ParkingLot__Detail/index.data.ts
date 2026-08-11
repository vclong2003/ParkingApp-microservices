import {trpc} from "@src/trpc";

export function useParkingLot(lotId: number) {
    const response = trpc.parking.lot.get.single.useQuery({
        id: lotId,
    });

    return response;
}
