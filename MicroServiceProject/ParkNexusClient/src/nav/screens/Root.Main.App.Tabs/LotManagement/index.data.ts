import {trpc} from "@src/trpc";

export function useMyParkingLots() {
    const response = trpc.parking.lot.get.many.useQuery({
        isMine: true,
    });

    const lots = response?.data || [];

    return Object.assign({lots}, response);
}
