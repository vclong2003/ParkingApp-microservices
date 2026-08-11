import React, {useState} from "react";
import {Keyboard, View} from "react-native";
import Mapbox from "@rnmapbox/maps";
import {useCallback, useEffect, useRef} from "react";
import {CameraRef} from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import {Button} from "@src/components/Button";
import {MapTypes} from "@src/types/types.map";
import {SearchBar} from "../Home.SearchBar";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useParkingLots} from "../index.$data";
import {useHomeContext} from "../index.$context";
import {styles} from "./index.styles";

import CurrentLocationSvg from "@src/static/svgs/CurrentLocation.svg";
import MapPinSvg from "@src/static/svgs/MapPin.svg";

Mapbox.setAccessToken(MapTypes.MAPBOX_ACCESS_TOKEN);
export function Map() {
    const cameraRef = useRef<CameraRef>(null);
    const {parkingLots} = useParkingLots();
    const {setSelectedLotId, selectedLocation, setSelectedLocation} = useHomeContext();
    const [isFollowUserLocation, setIsFollowUserLocation] = useState(true);

    const {bottom} = useSafeAreaInsets();

    const zoomToCurrentLocation = useCallback(() => {
        setSelectedLocation(undefined);
        setIsFollowUserLocation(true);
    }, [cameraRef, setIsFollowUserLocation]);

    const zoomToSelectedLocation = useCallback(() => {
        if (!selectedLocation) return;
        setIsFollowUserLocation(false);
        setTimeout(
            () =>
                cameraRef?.current?.setCamera({
                    centerCoordinate: [selectedLocation.lon, selectedLocation.lat],
                    zoomLevel: 14,
                    animationDuration: 1000,
                }),
            200,
        );
    }, [cameraRef, selectedLocation, setIsFollowUserLocation]);

    useEffect(() => {
        if (!selectedLocation) return;
        zoomToSelectedLocation();
    }, [selectedLocation, zoomToSelectedLocation]);

    return (
        <View style={styles.wrapper}>
            <SearchBar />
            <Mapbox.MapView
                onTouchStart={Keyboard.dismiss}
                style={{flex: 1}}
                logoEnabled={false}
                scaleBarEnabled={false}
                attributionEnabled={false}
                compassEnabled
                compassFadeWhenNorth
                onCameraChanged={event => {
                    if (event.gestures.isGestureActive) setIsFollowUserLocation(false);
                }}
                styleURL="mapbox://styles/vclong2003/cm4jpqw6m00bh01sf3iq9g8rf"
                compassPosition={{bottom: bottom + 100, left: 20}}>
                <Mapbox.Camera
                    ref={cameraRef}
                    animationDuration={3000}
                    followUserLocation={isFollowUserLocation}
                    followZoomLevel={16}
                    allowUpdates
                />

                {/* User location ------------------------------------------------ */}
                <Mapbox.Images>
                    <Mapbox.Image name="userLocationImage">
                        <View style={styles.userLocation} />
                    </Mapbox.Image>
                </Mapbox.Images>
                <Mapbox.LocationPuck topImage="userLocationImage" pulsing={{color: "#128085"}} />

                {/* Parking lots ------------------------------------------------ */}
                {parkingLots.map(({id, latitude, longitude}) => (
                    <Mapbox.PointAnnotation
                        key={id.toString()}
                        id={id.toString()}
                        coordinate={[longitude, latitude]}
                        onSelected={() => setSelectedLotId(id)}>
                        <MapPinSvg width={35} height={35} />
                    </Mapbox.PointAnnotation>
                ))}
            </Mapbox.MapView>

            {/* Zoom to current ------------------------------------------------ */}
            <Button
                variant="green"
                preIcon={<CurrentLocationSvg width={24} height={24} />}
                onPress={zoomToCurrentLocation}
                style={styles.zoomBtn}
            />
        </View>
    );
}
