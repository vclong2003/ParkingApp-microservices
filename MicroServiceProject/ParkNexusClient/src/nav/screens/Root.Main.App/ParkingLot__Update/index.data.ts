import {trpc} from '@src/trpc';

export function useMyParkingLot(lotId: number) {
    const response = trpc.parking.lot.get.single.useQuery({
        id: lotId,
    });

    return response;
}
