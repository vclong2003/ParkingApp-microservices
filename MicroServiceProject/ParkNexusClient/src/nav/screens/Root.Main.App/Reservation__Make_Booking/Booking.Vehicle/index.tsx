import React from "react";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {useMakeBookingContext} from "../index.context";
import {useParkingLotAvailability} from "../index.data";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {useMyVehicles} from "./index.data";
import {Button} from "@src/components/Button";
import {InputRadioButton} from "@src/components/Input__RadioButton";
import Toast from "react-native-toast-message";

export function Vehicle() {
    const {setStep, setVehicle, vehicle} = useMakeBookingContext();
    const {availableVehicleTypes} = useParkingLotAvailability();
    const {vehicles} = useMyVehicles();

    const onNext = () => {
        if (!vehicle) return Toast.show({type: "info", text1: "Please select a vehicle"});
        setStep("SERVICES");
    };

    return (
        <SafeAreaView>
            <Header title="Select vehicle" backButtonVisible onBackButtonPress={() => setStep("DATE_TIME")} />
            <ScrollView style={styles.wrapper}>
                {vehicles.map(v => {
                    const isAvailable = availableVehicleTypes.includes(v.type) && !v.isReserved;
                    return (
                        <Pressable
                            key={v.id}
                            onPress={() => {
                                if (isAvailable) setVehicle(v);
                            }}
                            style={[
                                styles.vehicleItem,
                                {
                                    opacity: isAvailable ? 1 : 0.6,
                                },
                            ]}>
                            <Text style={styles.vehicleItemText}>
                                {v.brand} {v.model} - {v.plate}
                                <View style={{width: 8}} />
                                <Text
                                    style={{
                                        color: isAvailable ? "#128085" : "#e70000t",
                                    }}>
                                    {isAvailable ? "Available" : v.isReserved ? "Reserved" : "Out of spot"}
                                </Text>
                            </Text>
                            <InputRadioButton
                                isSelected={v.id === vehicle?.id}
                                onPress={() => {
                                    if (isAvailable) setVehicle(v);
                                }}
                            />
                        </Pressable>
                    );
                })}
            </ScrollView>
            <Button variant="green" text="Next" onPress={onNext} style={styles.nextButton} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    vehicleItem: {
        backgroundColor: "#f4f4f4",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    vehicleItemText: {fontSize: 16, fontWeight: "600", color: "#3c3c3c"},
    nextButton: {margin: 16},
});
