import React from "react";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {useMakeBookingContext} from "../index.context";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useParkingLotDetail} from "../index.data";
import {Button} from "@src/components/Button";
import {useCreateTicker} from "./index.data";
import Toast from "react-native-toast-message";
import {BookingSuccessModal, TBookingSuccessModalRef} from "./index.modal";
import {useRef} from "react";
import dayjs from "dayjs";
import {openInGoogleMaps} from "@src/utils/location";
import {parseEnum} from "@src/utils/text";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {TabParamList} from "@src/nav/navigators/Root.Main.App.Tabs";

export function Summary() {
    const navigation = useNavigation<NavigationProp<TabParamList>>();
    const {lotId, startTime, endTime, services, vehicle, setStep} = useMakeBookingContext();
    const {lot} = useParkingLotDetail();
    const {createTicket, isPending} = useCreateTicker();
    const {showActionSheetWithOptions} = useActionSheet();

    const successModalRef = useRef<TBookingSuccessModalRef>(null);

    const onBook = () => {
        const options = ["Confirm Booking", "Cancel"];
        const destructiveButtonIndex = 1;
        const cancelButtonIndex = 1;

        showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    if (!lotId || !vehicle) return Toast.show({type: "error", text1: "Something went wrong"});
                    createTicket({
                        parkingLotId: lotId,
                        startTime: startTime.toISOString(),
                        endTime: endTime.toISOString(),
                        serviceIds: services.map(s => s.id),
                        vehicleId: vehicle.id,
                    }).then(({ticketId}) => successModalRef?.current?.show(ticketId));
                }
            },
        );
    };

    const calcPrice = () => {
        if (!lot) return;
        if (!vehicle) return;

        let total = 0;

        services.forEach(service => {
            total += service.price;
        });

        const vehicleType = vehicle.type;
        const pricePerHour = lot.parkingLotPrices.find(p => p.vehicleType === vehicleType)?.price || 0;
        const parkingHours = endTime.diff(startTime, "hours");

        return Math.round((total + pricePerHour * parkingHours) * 100) / 100;
    };

    return (
        <SafeAreaView>
            <Header title="Ticket Summary" backButtonVisible onBackButtonPress={() => setStep("SERVICES")} />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.infoSections}>
                    {/* Parking Lot Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Parking Lot</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Name:</Text>
                            <Text style={styles.value}>{lot?.name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Check-In time:</Text>
                            <Text style={styles.value}>
                                {lot?.openAt} - {lot?.closeAt}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Contact:</Text>
                            <Text style={styles.value}>{lot?.phone}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Location:</Text>
                            <Text
                                style={[styles.value, {textDecorationLine: "underline"}]}
                                onPress={() => openInGoogleMaps(lot?.latitude, lot?.longitude)}>
                                View on Google Maps
                            </Text>
                        </View>
                    </View>
                    {/* Vehicle Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Vehicle</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>{parseEnum(vehicle?.type)}:</Text>
                            <Text style={styles.value}>
                                {vehicle?.color} {vehicle?.brand} {vehicle?.model}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Plate:</Text>
                            <Text style={styles.value}>{vehicle?.plate}</Text>
                        </View>
                    </View>
                </View>

                {/* Services */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Services</Text>
                    {services.map(service => (
                        <View key={service.id} style={styles.row}>
                            <Text style={styles.label}>{service.name}</Text>
                            <Text style={styles.value}>${service.price}</Text>
                        </View>
                    ))}
                </View>
                <View style={{height: 1, backgroundColor: "#D9D9D9", marginBottom: 12}} />

                {/* Parking Fee */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Parking Fee</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Rate per hour</Text>
                        <Text style={styles.value}>
                            ${lot?.parkingLotPrices.find(p => p.vehicleType === vehicle?.type)?.price || 0}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Duration</Text>
                        <Text style={styles.value}>{dayjs(endTime).diff(startTime, "hours")} hours</Text>
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: "#D9D9D9", marginBottom: 12}} />

                {/* Total */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Total</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Price</Text>
                        <Text style={styles.totalText}>${calcPrice()}</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonsWrapper}>
                <Button variant="green" text="Book" disabled={isPending} onPress={onBook} style={{flex: 1}} />
                <Button
                    variant="pink"
                    text="Cancel"
                    disabled={isPending}
                    style={{flex: 2}}
                    onPress={() => navigation.navigate("Home")}
                />
            </View>
            <BookingSuccessModal ref={successModalRef} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    infoSections: {
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
    section: {
        padding: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333333",
        marginBottom: 8,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        color: "#333333",
        fontWeight: "500", // Make the label bolder
    },
    value: {
        fontSize: 16,
        color: "#555555",
        fontWeight: "400", // Regular weight for the value
    },
    totalText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#128085",
    },
    buttonsWrapper: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 10,
    },
});
