import {trpc} from "@src/trpc";

export function useMyParkingLotDetail(lotId: number) {
    const response = trpc.parking.lot.get.single.useQuery({id: lotId});

    const lot = response.data;

    return Object.assign({lot}, response);
}
