import {trpc} from "@src/trpc";
import {useMakeBookingContext} from "../index.context";

export function useMyVehicles() {
    const {startTime, endTime} = useMakeBookingContext();
    const response = trpc.user.vehicle.get.many.useQuery({
        availabilityStart: startTime.toISOString(),
        availabilityEnd: endTime.toISOString(),
    });

    const vehicles = response?.data || [];

    return Object.assign({vehicles}, response);
}
