import {useServiceManagerContext} from "../../index.context";

export function useParkingLotService() {
    const {selectedServiceId} = useServiceManagerContext();
}
