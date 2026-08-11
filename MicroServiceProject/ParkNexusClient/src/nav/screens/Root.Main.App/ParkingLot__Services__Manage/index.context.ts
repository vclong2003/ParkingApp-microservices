import constate from 'constate';
import {useState} from 'react';

type ServiceManagerContextProps = {
    lotId: number;
};
function useValues(props: ServiceManagerContextProps) {
    const [lotId] = useState(props.lotId);
    const [selectedServiceId, setSelectedServiceId] = useState<number>();

    return {
        lotId,

        selectedServiceId,
        setSelectedServiceId,
    };
}

export const [ServiceManagerContext, useServiceManagerContext] = constate(useValues);
