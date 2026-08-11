import constate from "constate";
import {useState} from "react";

type PriceManagerContextProps = {
    lotId: number;
};
function useValues(props: PriceManagerContextProps) {
    const [lotId] = useState(props.lotId);

    return {
        lotId,
    };
}

export const [PriceManagerContext, usePriceManagerContext] = constate(useValues);
