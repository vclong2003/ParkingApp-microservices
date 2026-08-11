import {trpc} from '@src/trpc';

export function useParkingLots() {
    const response = trpc.parking.lot.get.many.useQuery({
        isApproved: true,
    });

    const parkingLots = response?.data || [];

    return Object.assign({parkingLots}, response);
}
