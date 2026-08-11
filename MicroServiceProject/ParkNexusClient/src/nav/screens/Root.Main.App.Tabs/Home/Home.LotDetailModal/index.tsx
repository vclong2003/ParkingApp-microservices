import React from "react";
import Modal from "react-native-modal";
import Geolocation from "@react-native-community/geolocation";
import {useHomeContext} from "../index.$context";
import {Text, View} from "react-native";
import {styles} from "./index.styles";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Button} from "@src/components/Button";
import {useParkingLot} from "./index.$data";
import {getDirection, reverseGeocode} from "@src/utils/location";
import {useEffect, useState} from "react";

import MapPinSvg from "@src/static/svgs/MapPinArea.svg";
import LetterPSvg from "@src/static/svgs/LetterCircleP.svg";
import CaretRightSvg from "@src/static/svgs/CaretRight.svg";
import {LOT_SERVICE_ICONS} from "./index.types";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";

export function LotDetailModal() {
    const {navigate} = useNavigation<NavigationProp<AppStackParamList>>();

    const {selectedLotId, setSelectedLotId} = useHomeContext();
    const {bottom} = useSafeAreaInsets();
    const {data: lot} = useParkingLot();

    const [address, setAddress] = useState<string>("");
    const [distance, setDistance] = useState<number>(0);
    const prices = lot?.parkingLotPrices || [];
    const maxPrice = prices.reduce((acc, price) => Math.max(acc, price.price), 0);
    const minPrice = prices.reduce((acc, price) => Math.min(acc, price.price), maxPrice);

    const spotsAvailable = lot?.parkingSpots?.reduce((acc, spot) => {
        if (spot.isAvailable) return acc + 1;
        return acc;
    }, 0);

    useEffect(() => {
        if (!lot) return setAddress("");
        reverseGeocode({
            lat: lot?.latitude,
            lon: lot?.longitude,
        }).then(setAddress);
    }, [lot]);

    useEffect(() => {
        if (!lot) return;
        Geolocation.getCurrentPosition(pos => {
            getDirection({
                source: {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                },
                destination: {
                    lat: lot?.latitude,
                    lon: lot?.longitude,
                },
            }).then(data => setDistance(data?.distance || 0));
        });
    }, [lot]);

    return (
        <Modal
            animationIn="slideInUp"
            animationInTiming={400}
            animationOut={"slideOutDown"}
            animationOutTiming={700}
            style={{justifyContent: "flex-end", paddingBottom: bottom + 80}}
            isVisible={!!selectedLotId}
            hasBackdrop={false}
            swipeDirection="down"
            onSwipeComplete={() => setSelectedLotId(undefined)}
            coverScreen={false}>
            <View style={styles.wrapper}>
                <View style={styles.pill} />

                <View style={styles.titleWrapper}>
                    <View style={styles.titleItemWrapper}>
                        <Text style={styles.titleText} numberOfLines={1}>
                            {lot?.name}
                        </Text>
                        <Text style={styles.subTitleText}>{address}</Text>
                    </View>
                    <View style={styles.titleItemWrapper}>
                        <Text style={[styles.titleText, {textAlign: "right"}]}>${minPrice}</Text>
                        <Text style={styles.subTitleText}>per hour</Text>
                    </View>
                </View>

                <View style={styles.summaryWrapper}>
                    <View style={styles.summaryItemWrapper}>
                        <MapPinSvg width={24} height={24} />
                        <Text style={styles.summaryText}>
                            {distance < 1000 ? `${Math.round(distance)}m` : `${Math.round(distance / 1000)}km`}
                        </Text>
                    </View>
                    <View style={styles.summaryItemWrapper}>
                        <LetterPSvg width={24} height={24} />
                        <Text style={styles.summaryText}>{spotsAvailable} slots</Text>
                    </View>
                </View>

                <View style={styles.detailWrapper}>
                    <View style={styles.servicesWrapper}>
                        {lot?.parkingLotServices?.map((service, index) => (
                            <View key={index}>{LOT_SERVICE_ICONS[service.type]}</View>
                        ))}
                    </View>
                    <Button
                        onPress={() => navigate("ParkingLot__Detail", {lotId: lot?.id || 0})}
                        variant="white"
                        text="Details"
                        postIcon={<CaretRightSvg width={24} height={24} />}
                        style={styles.detailButton}
                        textProps={{style: styles.detailButtonText}}
                    />
                </View>

                {!lot?.isMine && (
                    <Button
                        variant="green"
                        text="Book now"
                        onPress={() => navigate("Reservation__Make_Booking", {lotId: lot?.id || 0})}
                    />
                )}
            </View>
        </Modal>
    );
}
