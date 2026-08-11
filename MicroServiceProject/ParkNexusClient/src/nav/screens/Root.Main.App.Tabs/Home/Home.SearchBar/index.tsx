import React from "react";
import {styles} from "./index.styles";
import {BlurView} from "@react-native-community/blur";
import Geolocation from "@react-native-community/geolocation";

import MagnifyingGlass from "@src/static/svgs/MagnifyingGlass.svg";
import {useSearchLocation} from "@src/utils/location";
import {Text, TextInput} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useHomeContext} from "../index.$context";
import {useEffect} from "react";

export function SearchBar() {
    const {setSelectedLocation, selectedLocation} = useHomeContext();
    const {query, setQuery, suggestions, setUserLocation} = useSearchLocation();
    const {top} = useSafeAreaInsets();

    useEffect(() => {
        if (!query) return setSelectedLocation(undefined);
        Geolocation.getCurrentPosition(pos => setUserLocation({lat: pos.coords.latitude, lon: pos.coords.longitude}));
    }, [query]);

    return (
        <>
            <BlurView blurType="light" blurAmount={8} style={[styles.wrapper, {top}]}>
                <MagnifyingGlass />
                <TextInput
                    placeholder="Search"
                    style={styles.textInput}
                    value={query}
                    onChangeText={setQuery}
                    clearButtonMode="while-editing"
                />
            </BlurView>
            {!selectedLocation && query && suggestions.length > 0 && (
                <BlurView blurType="light" blurAmount={8} style={[styles.suggestions, {top: top + 62}]}>
                    {suggestions.map((suggestion, index) => (
                        <Text key={index} style={{marginBottom: 10}} onPress={() => setSelectedLocation(suggestion)}>
                            {suggestion.address}
                        </Text>
                    ))}
                </BlurView>
            )}
        </>
    );
}
