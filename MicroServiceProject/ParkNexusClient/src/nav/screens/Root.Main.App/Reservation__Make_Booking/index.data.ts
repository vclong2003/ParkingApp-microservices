import {trpc} from '@src/trpc';
import {useMakeBookingContext} from './index.context';

export function useParkingLotAvailability() {
    const {lotId, startTime, endTime} = useMakeBookingContext();

    const response = trpc.parking.lot.availability.get.useQuery({
        lotId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
    });

    const availableVehicleTypes = response.data?.availableVehicleTypes || [];

    return Object.assign({availableVehicleTypes}, response);
}

export function useParkingLotDetail() {
    const {lotId} = useMakeBookingContext();

    const response = trpc.parking.lot.get.single.useQuery({
        id: lotId,
    });

    const lot = response.data;

    return Object.assign({lot}, response);
}
