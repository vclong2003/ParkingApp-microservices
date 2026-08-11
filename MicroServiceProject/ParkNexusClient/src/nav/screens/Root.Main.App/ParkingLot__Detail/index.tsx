import React from "react";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {Text, View, Dimensions, ActivityIndicator, ScrollView} from "react-native";
import {styles} from "./index.styles";
import {useParkingLot} from "./index.data";
import FastImage from "react-native-fast-image";
import {useEffect, useState} from "react";
import {getDirection, reverseGeocode} from "@src/utils/location";
import Carousel, {TCarouselProps} from "react-native-reanimated-carousel";
import {Button} from "@src/components/Button";

import StarFilledSvg from "@src/static/svgs/StarFilled.svg";
import MapPinAreaSvg from "@src/static/svgs/MapPinArea.svg";
import ClockSvg from "@src/static/svgs/Clock.svg";
import PhoneCallSvg from "@src/static/svgs/PhoneCall.svg";
import ArrowBendDoubleUpRight from "@src/static/svgs/ArrowBendDoubleUpRight.svg";
import ShareSvg from "@src/static/svgs/Share.svg";
import GasPumpSvg from "@src/static/svgs/GasPump.svg";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Geolocation from "@react-native-community/geolocation";

const deviceWidth = Dimensions.get("window").width;
const imageHeight = deviceWidth * (9 / 16);

type ScreenProps = {
    navigation: NavigationProp<AppStackParamList, "ParkingLot__Detail">;
    route: RouteProp<AppStackParamList, "ParkingLot__Detail">;
};

export function ParkingLot__Detail({route, navigation}: ScreenProps) {
    const {lotId} = route.params;
    const {data: lot} = useParkingLot(lotId);
    const {bottom} = useSafeAreaInsets();

    const [address, setAddress] = useState<string>("");
    const [distance, setDistance] = useState<number>(0);
    const [isFetchingImages, setIsFetchingImages] = useState<boolean>(false);
    const isMediaExists = lot?.mediaUrls && lot?.mediaUrls.length > 0;

    const carouselProps: TCarouselProps = {
        width: deviceWidth,
        data: lot?.mediaUrls || [],
        renderItem: ({item, index}) => (
            <View key={index} style={styles.imageWrapper}>
                <FastImage
                    source={{uri: `${item}`}}
                    style={{width: "100%", aspectRatio: 16 / 9}}
                    resizeMode="cover"
                    fallback
                    onLoadStart={() => setIsFetchingImages(true)}
                    onLoadEnd={() => setIsFetchingImages(false)}
                />
            </View>
        ),
        snapEnabled: true,
        autoPlay: true,
        autoPlayInterval: 3000,
    };

    useEffect(() => {
        if (lot) {
            reverseGeocode({
                lat: lot.latitude,
                lon: lot.longitude,
            }).then(setAddress);
        }
    }, [lot]);
    useEffect(() => {
        if (!lot) return setDistance(0);
        Geolocation.getCurrentPosition(position => {
            getDirection({
                source: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                destination: {
                    lat: lot.latitude,
                    lon: lot.longitude,
                },
            }).then(direction => setDistance(direction.distance));
        });
    }, [lot]);

    return (
        <SafeAreaView>
            <Header backButtonVisible title="Parking Lot Details" onBackButtonPress={() => navigation.goBack()} />
            <View style={{height: 16}} />
            {isMediaExists && (
                <>
                    <View style={{height: imageHeight}}>
                        {isFetchingImages ? <ActivityIndicator style={{marginTop: imageHeight / 2}} /> : null}
                        <Carousel {...carouselProps} />
                    </View>
                    <View style={{height: 8}} />
                </>
            )}

            <ScrollView style={styles.wrapper}>
                {/* Info --------------------------------------------------------------------------------------- */}
                <View style={styles.infoWrapper}>
                    {/* Name and address ---------------------------------- */}
                    <View style={styles.textWrapper}>
                        <Text style={styles.nameText}>{lot?.name}</Text>
                        <Text style={styles.addressText}>{address}</Text>
                    </View>
                    {/* Pills --------------------------------------------- */}
                    <View style={styles.pillsWrapper}>
                        <View style={styles.pill}>
                            <StarFilledSvg width={20} height={20} />
                            <Text style={styles.pillText}>4.2</Text>
                        </View>
                        <View style={styles.pill}>
                            <MapPinAreaSvg width={20} height={20} />
                            <Text style={styles.pillText}>
                                {distance < 1000 ? `${Math.round(distance)}m` : `${Math.round(distance / 1000)}km`}
                            </Text>
                        </View>
                        <View style={styles.pill}>
                            <ClockSvg width={20} height={20} />
                            <Text style={styles.pillText}>
                                {lot?.openAt} - {lot?.closeAt}
                            </Text>
                        </View>
                    </View>
                    {/* Info buttons --------------------------------------- */}
                    <View style={styles.infoButtonsWrapper}>
                        <Button variant="gray" preIcon={<PhoneCallSvg width={16} height={16} />} text="Call" />
                        <Button
                            variant="gray"
                            preIcon={<ArrowBendDoubleUpRight width={16} height={16} />}
                            text="Direction"
                        />
                        <Button variant="green" preIcon={<ShareSvg width={16} height={16} />} text="Share" />
                    </View>
                </View>
                {/* Services ---------------------------------------------------------------------------------- */}
                <View style={styles.servicesWrapper}>
                    <Text style={styles.serviceTitleText}>Service Provided</Text>
                    <View style={styles.serviceItemsWrapper}>
                        {lot?.parkingLotServices?.map((service, index) => (
                            <View key={index} style={styles.serviceItem}>
                                <GasPumpSvg width={24} height={24} />
                                <Text style={styles.serviceItemText}>{service.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                {/* Description -------------------------------------------------------------------------------- */}
                <View style={styles.descriptionWrapper}>
                    <Text style={styles.descriptionTitleText}>Description</Text>
                    <Text style={styles.descriptionText}>{lot?.description}</Text>
                </View>
            </ScrollView>

            {!lot?.isMine && (
                <Button
                    variant="green"
                    style={[styles.bookButton, {bottom: bottom + 16}]}
                    text="Book Parking"
                    textProps={{style: styles.bookButtonText}}
                    onPress={() => navigation.navigate("Reservation__Make_Booking", {lotId: lot?.id!})}
                />
            )}
            {lot?.isMine && (
                <Button
                    variant="gray"
                    style={[styles.bookButton, {bottom: bottom + 16}]}
                    text="Manage Your Parking Lot"
                    onPress={() => navigation.navigate("ParkingLot__MyLotDetail", {lotId: lot?.id!})}
                />
            )}
        </SafeAreaView>
    );
}
