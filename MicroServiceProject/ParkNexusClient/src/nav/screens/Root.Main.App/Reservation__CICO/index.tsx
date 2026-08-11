import React from "react";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useCustomerTicketDetail} from "./index.data";
import Toast from "react-native-toast-message";
import {Button} from "@src/components/Button";
import dayjs from "dayjs";
import FastImage from "react-native-fast-image";
import {parseEnum} from "@src/utils/text";
import {useCheckIn, useCheckOut} from "./index.submit";
import {useActionSheet} from "@expo/react-native-action-sheet";

type ScreenParams = {
    navigation: NavigationProp<AppStackParamList>;
    route: RouteProp<AppStackParamList, "Reservation__CICO">;
};
export function Reservation__CICO({route, navigation}: ScreenParams) {
    const ticketCode = route.params.ticketCode;
    const {ticket, isError} = useCustomerTicketDetail(ticketCode);
    const {showActionSheetWithOptions} = useActionSheet();
    const {checkIn, isPending: isCheckInPending} = useCheckIn();
    const {checkOut, isPending: isCheckOutPending} = useCheckOut();

    const isAwaitingPayment = ticket?.paymentRecord?.status === "AWAITING";
    const isPending = ticket?.status === "PENDING";
    const isOngoing = ticket?.status === "ON_GOING";
    const isExpired = ticket?.status === "EXPIRED";
    const isOverstayed = ticket?.status === "OVERSTAYED";
    const isCancelled = ticket?.status === "CANCELLED";

    const onCheckIn = () => {
        const options = ["Confirm Check-In", "Cancel"];
        const destructiveButtonIndex = 0;
        const cancelButtonIndex = 1;

        showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            buttonIndex => {
                if (buttonIndex === 0) checkIn(ticketCode);
            },
        );
    };

    const onCheckOut = () => {
        const options = ["Confirm Check-Out", "Cancel"];
        const destructiveButtonIndex = 0;
        const cancelButtonIndex = 1;

        showActionSheetWithOptions(
            {
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            buttonIndex => {
                if (buttonIndex === 0) checkOut(ticketCode);
            },
        );
    };

    const renderRow = (label: string, value: string | React.ReactNode, valueStyle?: object) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={[styles.value, valueStyle]}>{value}</Text>
        </View>
    );

    const renderTicketInfo = () => {
        if (!ticket) return null;

        return (
            <View style={styles.ticketContainer}>
                {/* Ticket Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ticket Details</Text>
                    {renderRow(
                        "Status",
                        <Text style={{color: isPending ? "#128085" : "#B33E00"}}>{parseEnum(ticket.status)}</Text>,
                    )}
                    {renderRow(
                        "Time",
                        `${dayjs(ticket.startTime).format("HH:mm MMM DD")} - ${dayjs(ticket.endTime).format(
                            "HH:mm MMM DD",
                        )}`,
                    )}
                </View>

                {/* Parking Spot Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Parking Spot</Text>
                    {renderRow("Name", ticket.parkingSpot.name)}
                    {renderRow("Lot", ticket.parkingSpot.parkingLot.name)}
                    {renderRow("Type", parseEnum(ticket.parkingSpot.vehicleType))}
                </View>

                {/* Vehicle Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicle Info</Text>
                    {ticket.vehicle.imageUrl && (
                        <FastImage source={{uri: ticket.vehicle.imageUrl}} style={styles.vehicleImage} fallback />
                    )}
                    {renderRow(
                        parseEnum(ticket.vehicle.type),
                        `${ticket.vehicle.color} ${ticket.vehicle.brand} ${ticket.vehicle.model}`,
                    )}
                    {renderRow("Plate", ticket.vehicle.plate)}
                </View>

                {/* Services */}
                {ticket.services && ticket.services.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Services</Text>
                        {ticket.services.map(service =>
                            renderRow(service.name, `$${service.price}`, {color: "#128085"}),
                        )}
                    </View>
                )}

                {/* Payment Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Info</Text>
                    {renderRow("Amount", `$${ticket.paymentRecord?.amountInUsd}`)}
                    {renderRow(
                        "Status",
                        <Text style={{color: isAwaitingPayment ? "#B33E00" : "#128085"}}>
                            {parseEnum(ticket.paymentRecord?.status)}
                        </Text>,
                    )}
                </View>
            </View>
        );
    };

    if (isError) {
        Toast.show({
            type: "error",
            text1: "Invalid QR Code",
        });
        navigation.goBack();
        return null;
    }
    return (
        <SafeAreaView>
            <Header title="Check In/Check Out" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
            <ScrollView style={styles.wrapper}>{renderTicketInfo()}</ScrollView>
            {isPending && !isAwaitingPayment && (
                <Button
                    variant="gray"
                    text="Check In"
                    onPress={onCheckIn}
                    style={styles.button}
                    disabled={isAwaitingPayment || isCheckInPending}
                />
            )}
            {(isOngoing || isOverstayed) && (
                <Button
                    variant="pink"
                    text="Check Out"
                    onPress={onCheckOut}
                    disabled={isCheckOutPending}
                    style={styles.button}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
    },
    ticketContainer: {
        marginVertical: 16,
    },
    section: {
        marginBottom: 16,
        backgroundColor: "#f6f6f6",
        padding: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2D2D2D",
        marginBottom: 8,
    },
    vehicleImage: {
        width: "100%",
        aspectRatio: 16 / 9,
        borderRadius: 8,
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        color: "#6C6C6C",
        fontWeight: "700",
    },
    value: {
        fontSize: 16,
        color: "#333333",
        textAlign: "right",
        fontWeight: "400",
    },
    button: {
        margin: 16,
        borderRadius: 8,
    },
});
