import constate from 'constate';
import {useState} from 'react';

function useValues() {
    const [selectedLotId, setSelectedLotId] = useState<number | undefined>();
    const [selectedLocation, setSelectedLocation] = useState<{lat: number; lon: number} | undefined>();
    const [userLocation, setUserLocation] = useState<{lat?: number; lon?: number}>({
        lat: undefined,
        lon: undefined,
    });

    return {
        selectedLotId,
        setSelectedLotId,

        selectedLocation,
        setSelectedLocation,

        userLocation,
        setUserLocation,
    };
}

export const [HomeContext, useHomeContext] = constate(useValues);
