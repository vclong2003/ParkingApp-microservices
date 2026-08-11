import Geolocation from "@react-native-community/geolocation";
import {Position} from "@rnmapbox/maps/lib/typescript/src/types/Position";
import {useCallback, useEffect, useState} from "react";
import {TFeatureCollection, TLocationSuggestion, TRouteResponse} from "./index.types";
import axios from "axios";
import {MapTypes} from "@src/types/types.map";
import {useDebounce} from "../debounce";
import {Linking} from "react-native";

// User Location ----------------------------------------------------------------------------
export function useUserLocation() {
    const [userLocation, setUserLocation] = useState<Position | undefined>();
    const [locationWatchId, setLocationWatchId] = useState<number | undefined>();

    const watchUserLocation = useCallback(() => {
        Geolocation.watchPosition(
            ({coords: {longitude, latitude}}) => {
                console.log("watchPosition ---------", {longitude, latitude});
                setUserLocation([longitude, latitude]);
            },
            error => console.error(error),
            {enableHighAccuracy: true, timeout: 1000},
        );
    }, [locationWatchId]);
    const stopWatchingUserLocation = useCallback(() => {
        if (locationWatchId) {
            Geolocation.clearWatch(locationWatchId);
            setLocationWatchId(undefined);
        }
    }, [locationWatchId]);

    useEffect(() => {
        watchUserLocation();
    }, []);

    return {userLocation, watchUserLocation, stopWatchingUserLocation};
}

// Location search suggestion  ------------------------------------------------------------------
export function useSearchLocation() {
    const [query, setQuery] = useState("");
    const [userLocation, setUserLocation] = useState<{lat?: number; lon?: number}>();
    const [suggestions, setSuggestions] = useState<TLocationSuggestion[]>([]);
    const debouncedQuery = useDebounce<string>(query, 300);

    const searchLocation = useCallback(async () => {
        if (!debouncedQuery.trim()) return setSuggestions([]);
        const {lat, lon} = userLocation || {};
        const payload = encodeURIComponent(debouncedQuery);
        const endpoint = `${MapTypes.MAPBOX_GEOCODE_API}/forward?q=${payload}&proximity=${lon || 0},${
            lat || 0
        }&access_token=${MapTypes.MAPBOX_PUBLIC_ACCESS_TOKEN}`;

        const response = await axios.get(endpoint);
        const data = response.data as TFeatureCollection;

        const suggestions: TLocationSuggestion[] = data.features.map(feature => ({
            address: feature.properties.full_address,
            lat: feature.properties.coordinates.latitude,
            lon: feature.properties.coordinates.longitude,
        }));
        setSuggestions(suggestions);
    }, [debouncedQuery, userLocation]);

    useEffect(() => {
        searchLocation();
    }, [debouncedQuery]);

    return {query, setQuery, userLocation, setUserLocation, suggestions};
}

// Reverse Geocoding ----------------------------------------------------------------------------
export async function reverseGeocode({lat, lon}: {lat?: number; lon?: number}): Promise<string> {
    const endpoint = `${MapTypes.MAPBOX_GEOCODE_API}/reverse?longitude=${lon || 0}&latitude=${lat || 0}&access_token=${
        MapTypes.MAPBOX_PUBLIC_ACCESS_TOKEN
    }`;
    const response = await axios.get(endpoint);
    const featureCollection = response.data as TFeatureCollection;
    return featureCollection.features?.[0]?.properties?.full_address || "";
}

// Get direction  -------------------------------------------------------------------------------
type TGetDirectionPayload = {
    source: {
        lat?: number;
        lon?: number;
    };
    destination: {
        lat?: number;
        lon?: number;
    };
};
export async function getDirection({source, destination}: TGetDirectionPayload) {
    const endpoint = `${MapTypes.MAPBOX_DIRECTIONS_API}/mapbox/driving/${source.lon || 0},${source.lat || 0};${
        destination.lon || 0
    },${destination.lat || 0}?access_token=${MapTypes.MAPBOX_PUBLIC_ACCESS_TOKEN}`;
    const response = await axios.get(endpoint);
    const routes = response.data as TRouteResponse;
    return routes?.routes?.[0] || null;
}

// Open in Google Maps  -------------------------------------------------------------------------------
export function openInGoogleMaps(latitude: number = 0, longitude: number = 0) {
    const url = `https://www.google.com/maps/?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error("An error occurred", err));
}
