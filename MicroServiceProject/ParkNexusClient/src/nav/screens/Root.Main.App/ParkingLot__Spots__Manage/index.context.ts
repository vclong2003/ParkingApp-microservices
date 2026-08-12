import constate from "constate";
import {useState} from "react";

type SpotManagerContextProps = {
    lotId: number;
};

function useValues(props: SpotManagerContextProps) {
    const [lotId] = useState(props.lotId);

    const [selectedSpot, setSelectedSpot] = useState();

    const [selectedReservedSpotId, setSelectedReservedSpotId] = useState<number>();

    return {
        lotId,

        selectedSpot,
        setSelectedSpot,

        selectedReservedSpotId,
        setSelectedReservedSpotId,
    };
}

export const [SpotManagerContext, useSpotManagerContext] = constate(useValues);
