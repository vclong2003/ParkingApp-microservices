import React, {useState} from "react";
import dayjs from "dayjs";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {RESERVATION__STATUS_ALIAS} from "@parknexus/api/prisma/client";
import {useMyTickets} from "./index.data";
import {Button} from "@src/components/Button";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {openInGoogleMaps} from "@src/utils/location";

import CalendarRemoveSvg from "@src/static/svgs/CalendarRemove.svg";
import CalendarSmallSvg from "@src/static/svgs/CalendarSmall.svg";
import CalendarSuccessSvg from "@src/static/svgs/CalendarSuccess.svg";
import CalendarTimeSvg from "@src/static/svgs/CalendarTime.svg";
import CarTealSvg from "@src/static/svgs/CarTeal.svg";
import TruckTealSvg from "@src/static/svgs/TruckTeal.svg";
import MotorcycleTealSvg from "@src/static/svgs/MotorcycleTeal.svg";
import ArrowBendDoubleUpRight from "@src/static/svgs/ArrowBendDoubleUpRight.svg";
import QrCodeTealSvg from "@src/static/svgs/QrCodeTeal.svg";
import TimeDarkGraySvg from "@src/static/svgs/TimeDarkGray.svg";

export function Ticket() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const {bottom} = useSafeAreaInsets();
    const [status, setStatus] = useState<RESERVATION__STATUS_ALIAS>();
    const {tickets, refetch, isFetching} = useMyTickets({status});

    const onSetStatus = (s: RESERVATION__STATUS_ALIAS) => {
        if (status === s) setStatus(undefined);
        else setStatus(s);
    };

    const getStatusStyle = (status: RESERVATION__STATUS_ALIAS) => {
        switch (status) {
            case "PENDING":
                return styles.statusPending;
            case "ON_GOING":
                return styles.statusOngoing;
            case "COMPLETED":
                return styles.statusFinished;
            case "EXPIRED":
                return styles.statusExpired;
            case "OVERSTAYED":
                return styles.statusOverstayed;
            case "CANCELLED":
                return styles.statusCancelled;
            default:
                return null;
        }
    };

    const getVehicleIcon = (vehicleType: string) => {
        switch (vehicleType) {
            case "CAR":
                return <CarTealSvg width={24} height={24} />;
            case "TRUCK":
                return <TruckTealSvg width={24} height={24} />;
            case "MOTORCYCLE":
                return <MotorcycleTealSvg width={24} height={24} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView>
            <Header title="My Tickets" />
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filter}>
                    <Button
                        style={[styles.filterButton, {opacity: status === "PENDING" ? 0.6 : 1}]}
                        textProps={{style: styles.filterButtonText}}
                        variant="green"
                        preIcon={<CalendarSmallSvg width={18} height={18} />}
                        text="Up Coming"
                        onPress={() => onSetStatus("PENDING")}
                    />
                    <Button
                        style={[styles.filterButton, {opacity: status === "ON_GOING" ? 0.6 : 1}]}
                        textProps={{style: styles.filterButtonText}}
                        variant="green"
                        preIcon={<CalendarTimeSvg width={18} height={18} />}
                        text="On Going"
                        onPress={() => onSetStatus("ON_GOING")}
                    />
                    <Button
                        style={[styles.filterButton, {opacity: status === "COMPLETED" ? 0.6 : 1}]}
                        textProps={{style: styles.filterButtonText}}
                        variant="green"
                        preIcon={<CalendarSuccessSvg width={18} height={18} />}
                        text="Finished"
                        onPress={() => onSetStatus("COMPLETED")}
                    />
                    <Button
                        style={[styles.filterButton, {opacity: status === "CANCELLED" ? 0.6 : 1}]}
                        textProps={{style: styles.filterButtonText}}
                        variant="green"
                        preIcon={<CalendarRemoveSvg width={18} height={18} />}
                        text="Canceled"
                        onPress={() => onSetStatus("CANCELLED")}
                    />
                </ScrollView>
            </View>
            <ScrollView style={[styles.wrapper]}>
                <RefreshControl refreshing={isFetching} onRefresh={refetch} />
                <View style={{height: 4}} />
                {tickets.map(ticket => (
                    <View key={ticket.id} style={styles.ticketCard}>
                        <View style={styles.statusTag}>
                            <Text style={[styles.statusText, getStatusStyle(ticket.status)]}>{ticket.status}</Text>
                        </View>
                        <View style={styles.ticketHeader}>
                            {getVehicleIcon(ticket.vehicle.type)}
                            <Text style={styles.ticketCode}>{ticket.parkingSpot.parkingLot.name}</Text>
                        </View>
                        <Text style={styles.ticketDate}>
                            <TimeDarkGraySvg width={18} height={18} style={{marginRight: 5, marginBottom: -3}} />
                            {dayjs(ticket.startTime).format("MMM DD, HH:mm")} -{" "}
                            {dayjs(ticket.endTime).format("MMM DD, HH:mm")}
                        </Text>
                        <View style={styles.ticketButtonsWrapper}>
                            <Button
                                preIcon={<QrCodeTealSvg width={22} height={22} />}
                                text=""
                                variant="gray"
                                style={styles.ticketButton}
                                onPress={() => navigation.navigate("Reservation__Ticket_Detail", {ticketId: ticket.id})}
                            />
                            {["PENDING", "ON_GOING", "OVERSTAYED"].includes(ticket.status) && (
                                <Button
                                    preIcon={<ArrowBendDoubleUpRight width={22} height={22} />}
                                    text=""
                                    variant="gray"
                                    style={styles.ticketButton}
                                    onPress={() =>
                                        openInGoogleMaps(
                                            ticket.parkingSpot.parkingLot.latitude,
                                            ticket.parkingSpot.parkingLot.longitude,
                                        )
                                    }
                                />
                            )}
                        </View>
                    </View>
                ))}
                <View style={{height: bottom + 80}} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    filter: {
        paddingHorizontal: 8,
        marginVertical: 12,
        gap: 4,
    },
    filterButton: {
        height: 32,
    },
    filterButtonText: {
        fontSize: 14,
    },
    wrapper: {
        paddingHorizontal: 16,
        flex: 1,
    },
    ticketCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Android shadow
        position: "relative",
    },
    statusTag: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#f6f6f6",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    statusPending: {
        color: "#FFA500",
    },
    statusOngoing: {
        color: "#007BFF",
    },
    statusFinished: {
        color: "#28A745",
    },
    statusExpired: {
        color: "#DC3545",
    },
    statusOverstayed: {
        color: "#FF5733",
    },
    statusCancelled: {
        color: "#6C757D",
    },
    ticketHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    ticketCode: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
    },
    ticketDate: {
        fontSize: 14,
        marginBottom: 8,
        color: "#555555",
    },
    ticketButtonsWrapper: {
        flexDirection: "row",
        gap: 8,
    },
    ticketButton: {
        marginTop: 8,
        backgroundColor: "#f5f5f5",
        flex: 1,
    },
});
