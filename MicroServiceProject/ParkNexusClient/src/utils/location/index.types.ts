export type TFeatureCollection = {
    type: string;
    features: {
        type: string;
        id: string;
        geometry: {
            type: string;
            coordinates: number[];
        };
        properties: {
            mapbox_id: string;
            feature_type: string;
            full_address: string;
            name: string;
            name_preferred: string;
            coordinates: {
                longitude: number;
                latitude: number;
            };
            place_formatted: string;
            bbox: number[];
            context: {
                place: {
                    mapbox_id: string;
                    name: string;
                    wikidata_id: string;
                    short_code?: string;
                };
                region: {
                    mapbox_id: string;
                    name: string;
                    wikidata_id: string;
                    region_code: string;
                    region_code_full: string;
                };
                country: {
                    mapbox_id: string;
                    name: string;
                    wikidata_id: string;
                    country_code: string;
                    country_code_alpha_3: string;
                };
                locality?: {
                    mapbox_id: string;
                    name: string;
                    wikidata_id: string;
                };
                postcode?: {
                    mapbox_id: string;
                    name: string;
                };
                neighborhood?: {
                    mapbox_id: string;
                    name: string;
                    wikidata_id: string;
                };
            };
        };
    }[];
};

export type TLocationSuggestion = {
    address: string;
    lat: number;
    lon: number;
};

export type TRouteResponse = {
    routes: {
        weight_name: string;
        weight: number;
        duration: number;
        distance: number;
        legs: {
            notifications: {
                details: {
                    actual_value: string;
                    message: string;
                };
                subtype: string;
                type: string;
                geometry_index_end: number;
                geometry_index_start: number;
            }[];
            via_waypoints: any[]; // Empty array, adjust if more details available
            admins: {
                iso_3166_1_alpha3: string;
                iso_3166_1: string;
            }[];
            weight: number;
            duration: number;
            steps: any[]; // Empty array, adjust if more details available
            distance: number;
            summary: string;
        }[];
        geometry: string;
    }[];
    waypoints: {
        distance: number;
        name: string;
        location: [number, number];
    }[];
    code: string;
    uuid: string;
};
