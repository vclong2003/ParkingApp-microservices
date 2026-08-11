import {trpc} from '@src/trpc';
import {useServiceManagerContext} from '../../index.context';

export function useParkingLotService() {
    const {selectedServiceId} = useServiceManagerContext();

    const response = trpc.parking.lot.service.get.single.useQuery(
        {
            serviceId: selectedServiceId!,
        },
        {
            enabled: !!selectedServiceId,
        },
    );

    const service = response.data;

    return Object.assign({service}, response);
}
