import {trpc} from '@src/trpc';

export function useVehicles() {
    const response = trpc.user.vehicle.get.many.useQuery({});

    const vehicles = response?.data || [];

    return Object.assign({vehicles}, response);
}
