import React from "react";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet";
import {TServiceItem, useServiceDetail} from "./index.data";
import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {Button} from "@src/components/Button";
import {useMakeBookingContext} from "../index.context";
import Carousel, {TCarouselProps} from "react-native-reanimated-carousel";
import FastImage from "react-native-fast-image";
import {BottomSheetBackdrop} from "@src/components/BottomSheetBackdrop";

export type TServiceDetailSheetRef = {
    show: (serviceId: number) => void;
};
export const ServiceDetailSheet = forwardRef<TServiceDetailSheetRef>(({}, ref) => {
    const [serviceId, setServiceId] = useState<number>();
    const {services, setServices} = useMakeBookingContext();
    const {service} = useServiceDetail(serviceId);
    const [isFetchingImages, setIsFetchingImages] = useState(false);

    const sheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
        show: (serviceId: number) => {
            setServiceId(serviceId);
            sheetRef.current?.present();
        },
    }));

    const isMediaExists = service?.mediaUrls?.length && service?.mediaUrls?.length > 0;
    console.log("isMediaExists", isMediaExists);
    const deviceWidth = Dimensions.get("window").width;
    const imageHeight = (deviceWidth / 3) * 2;

    const carouselProps: TCarouselProps = {
        width: deviceWidth - 16 * 2,
        data: service?.mediaUrls || [],
        renderItem: ({item, index}) => (
            <View key={index} style={styles.imageWrapper}>
                <FastImage
                    source={{uri: item}}
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

    const isSelected = services.some((service: TServiceItem) => service.id === serviceId);
    const toggleSelect = () => {
        if (!serviceId) return;
        if (isSelected) {
            setServices(services.filter((service: TServiceItem) => service.id !== serviceId));
        } else {
            setServices([...services, service!]);
        }
        sheetRef.current?.dismiss();
    };

    return (
        <BottomSheetModal ref={sheetRef} snapPoints={["60%"]} backdropComponent={BottomSheetBackdrop}>
            <BottomSheetView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Service Title */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{service?.name}</Text>
                        <Text style={styles.price}>${service?.price}</Text>
                    </View>

                    {/* Service Description */}
                    {service?.description && <Text style={styles.description}>{service.description}</Text>}

                    {/* Media Carousel */}
                    {isMediaExists ? (
                        <>
                            <View style={{height: imageHeight}}>
                                {isFetchingImages && <ActivityIndicator style={{marginTop: imageHeight / 2}} />}
                                <Carousel {...carouselProps} />
                            </View>
                            <View style={{height: 8}} />
                        </>
                    ) : null}
                </ScrollView>

                {/* Bottom Action Button */}
                <Button
                    variant={isSelected ? "pink" : "green"}
                    text={isSelected ? "Remove" : `Add ($${service?.price})`}
                    onPress={toggleSelect}
                    style={styles.actionButton}
                />
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContainer: {
        paddingBottom: 16,
    },
    titleSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
    },
    price: {
        fontSize: 18,
        fontWeight: "600",
        color: "#128085",
    },
    description: {
        fontSize: 16,
        color: "#555",
        marginBottom: 16,
    },
    imageWrapper: {
        marginHorizontal: 2,
        borderRadius: 8,
        overflow: "hidden",
    },
    actionButton: {
        marginBottom: 36,
    },
});
