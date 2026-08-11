import {trpc} from '@src/trpc';
import {useHomeContext} from '../index.$context';

export function useParkingLot() {
    const {selectedLotId} = useHomeContext();

    const response = trpc.parking.lot.get.single.useQuery(
        {
            id: selectedLotId!,
        },
        {
            enabled: !!selectedLotId,
        },
    );

    return response;
}
