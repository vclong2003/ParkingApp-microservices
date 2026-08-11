import React from "react";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {useMakeBookingContext} from "../index.context";
import {ScrollView} from "react-native-gesture-handler";
import {Button} from "@src/components/Button";
import {useParkingLotDetail} from "../index.data";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRef} from "react";
import {ServiceDetailSheet, TServiceDetailSheetRef} from "./index.sheet";

import CarTealSvg from "@src/static/svgs/CarTeal.svg";
import MotorcycleTealSvg from "@src/static/svgs/MotorcycleTeal.svg";
import TruckTealSvg from "@src/static/svgs/TruckTeal.svg";

export function Services() {
    const {setStep, services, vehicle} = useMakeBookingContext();
    const {lot} = useParkingLotDetail();

    const selectedVehicleType = vehicle?.type;
    const detailSheetRef = useRef<TServiceDetailSheetRef>(null);

    const isSelected = (serviceId: number) => services.some(service => service.id === serviceId);
    const getVehicleIcon = (vehicleType: string) => {
        switch (vehicleType) {
            case "CAR":
                return <CarTealSvg key={vehicleType} width={24} height={24} style={styles.icon} />;
            case "TRUCK":
                return <TruckTealSvg key={vehicleType} width={24} height={24} style={styles.icon} />;
            case "MOTORCYCLE":
                return <MotorcycleTealSvg key={vehicleType} width={24} height={24} style={styles.icon} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView>
            <Header title="Select Services" backButtonVisible onBackButtonPress={() => setStep("VEHICLE")} />
            <ScrollView style={styles.container}>
                {lot?.parkingLotServices.map((service, index) => {
                    const isApplicable = service.vehicleTypes.includes(selectedVehicleType || ("" as any));
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.card,
                                isSelected(service.id) && isApplicable && styles.cardSelected,
                                !isApplicable && styles.cardDisabled,
                            ]}
                            disabled={!isApplicable}
                            onPress={() => detailSheetRef?.current?.show(service.id)}>
                            <View style={styles.cardContent}>
                                <View>
                                    <Text style={[styles.serviceName, !isApplicable && styles.textDisabled]}>
                                        {service.name}
                                    </Text>
                                    <Text style={[styles.servicePrice, !isApplicable && styles.textDisabled]}>
                                        ${service.price}
                                    </Text>
                                </View>
                                <View style={styles.vehicleIcons}>
                                    {["CAR", "TRUCK", "MOTORCYCLE"].map(type => getVehicleIcon(type))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <ServiceDetailSheet ref={detailSheetRef} />
            <Button variant="green" text="Next" onPress={() => setStep("SUMMARY")} style={styles.nextButton} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#f7f7f7",
    },
    cardSelected: {
        borderColor: "#128085",
        backgroundColor: "#e0f7fa",
    },
    cardDisabled: {
        backgroundColor: "#e0e0e0",
        borderColor: "#d6d6d6",
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: "500",
        color: "#555",
    },
    textDisabled: {
        color: "#a3a3a3",
    },
    vehicleIcons: {
        flexDirection: "row",
        gap: 8,
    },
    icon: {
        opacity: 1,
    },
    nextButton: {
        margin: 16,
    },
});
