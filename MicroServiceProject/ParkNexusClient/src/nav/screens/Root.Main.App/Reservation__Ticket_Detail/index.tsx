import React from "react";
import {NavigationProp, RouteProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {useTicketDetail} from "./index.data";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {Header} from "@src/components/Header";
import QRCode from "react-native-qrcode-svg";
import {TabParamList} from "@src/nav/navigators/Root.Main.App.Tabs";
import {ScrollView} from "react-native-gesture-handler";
import {StyleSheet, Text, View} from "react-native";
import dayjs from "dayjs";
import {Button} from "@src/components/Button";
import {EXPIRATION_TIME_IN_HOURS, MAXIMUM_OVERSTAYING_DURATION_IN_HOURS} from "@parknexus/api/rules";
import {openInGoogleMaps} from "@src/utils/location";
import {useCancel} from "./index.cancel";
import {useActionSheet} from "@expo/react-native-action-sheet";

type ScreenProps = {
    navigation: NavigationProp<AppStackParamList, "Reservation__Ticket_Detail">;
    route: RouteProp<AppStackParamList, "Reservation__Ticket_Detail">;
};
export function Reservation__Ticket_Detail({route, navigation}: ScreenProps) {
    const tabNavigation = useNavigation<NavigationProp<TabParamList>>();
    const {showActionSheetWithOptions} = useActionSheet();
    const {ticket} = useTicketDetail(route.params.ticketId);
    const {cancel} = useCancel();

    const ticketCode = ticket?.code;

    const lat = ticket?.parkingSpot?.parkingLot?.latitude;
    const lon = ticket?.parkingSpot?.parkingLot?.longitude;

    const isAwaitingPayment = ticket?.paymentRecord?.status === "AWAITING";
    const isPending = ticket?.status === "PENDING";

    const onCancel = () => {
        showActionSheetWithOptions(
            {
                options: ["Confirm", "Cancel"],
                destructiveButtonIndex: 0,
                cancelButtonIndex: 1,
                title: "Cancel Ticket",
                message: "Are you sure you want to cancel this ticket?",
            },
            buttonIndex => {
                if (buttonIndex === 0) cancel({id: route.params.ticketId});
            },
        );
    };

    return (
        <SafeAreaView>
            <Header title="Ticket" backButtonVisible onBackButtonPress={() => tabNavigation.navigate("Ticket")} />
            <ScrollView style={styles.scrollView}>
                <View style={styles.ticketContainer}>
                    <View style={styles.contentContainer}>
                        {ticket?.status === "PENDING" && (
                            <Text style={styles.statusText}>
                                The ticket will be expired at{" "}
                                <Text style={styles.statusTextHighlight}>
                                    {dayjs(ticket?.startTime)
                                        .add(EXPIRATION_TIME_IN_HOURS, "hour")
                                        .format("MMM DD  HH:mm")}
                                </Text>
                            </Text>
                        )}
                        {ticket?.status === "CANCELLED" && (
                            <Text style={styles.statusText}>The ticket has been cancelled</Text>
                        )}
                        {ticket?.status === "ON_GOING" && (
                            <Text style={styles.statusText}>
                                Please check out before{" "}
                                <Text style={styles.statusTextHighlight}>
                                    {dayjs(ticket?.endTime)
                                        .add(MAXIMUM_OVERSTAYING_DURATION_IN_HOURS, "hour")
                                        .format("MMM DD  HH:mm")}
                                </Text>{" "}
                                to avoid additional charges
                            </Text>
                        )}
                        {ticket?.status === "EXPIRED" && (
                            <Text style={styles.statusText}>Your ticket has been expired</Text>
                        )}
                        <View style={styles.spacerSmall} />
                        <View style={styles.qrCodeWrapper}>
                            <QRCode color="#FAFAFA" backgroundColor={"#128085"} size={180} value={ticketCode} />
                        </View>
                    </View>
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLeft} />
                        <View style={styles.dividerLine} />
                        <View style={styles.dividerRight} />
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.infoColumn}>
                            <Text style={styles.labelTitle}>Parking Lot</Text>
                            <View style={styles.spacerXs} />
                            <Text numberOfLines={1} style={styles.labelValue}>
                                {ticket?.parkingSpot?.parkingLot?.name}
                            </Text>

                            <View style={styles.spacerSm} />

                            <Text style={styles.labelTitle}>Vehicle</Text>
                            <View style={styles.spacerXs} />
                            <Text numberOfLines={1} style={styles.labelValue}>
                                {ticket?.vehicle?.brand} {ticket?.vehicle?.model}
                            </Text>

                            <View style={styles.spacerSm} />

                            <Text style={styles.labelTitle}>Start Time</Text>
                            <View style={styles.spacerXs} />
                            <Text numberOfLines={1} style={styles.labelValue}>
                                {dayjs(ticket?.startTime).format("MMM DD  HH:mm")}
                            </Text>
                        </View>
                        <View style={{width: 8}} />
                        <View style={styles.infoColumn}>
                            <Text style={styles.labelTitle}>Phone</Text>
                            <View style={styles.spacerXs} />
                            <Text numberOfLines={1} style={styles.labelValue}>
                                {ticket?.parkingSpot?.parkingLot?.phone}
                            </Text>

                            <View style={styles.spacerSm} />

                            <Text style={styles.labelTitle}>Parking Spot</Text>
                            <View style={styles.spacerXs} />
                            <Text numberOfLines={1} style={styles.labelValue}>
                                {ticket?.parkingSpot?.name}
                            </Text>

                            <View style={styles.spacerSm} />

                            <Text style={styles.labelTitle}>End Time</Text>
                            <View style={styles.spacerXs} />
                            <Text numberOfLines={1} style={styles.labelValue}>
                                {dayjs(ticket?.endTime).format("MMM DD  HH:mm")}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.spacerMd} />
                <View style={styles.actionsContainer}>
                    <Button
                        variant="gray"
                        text="Navigate"
                        style={{flex: 1}}
                        onPress={() => openInGoogleMaps(lat, lon)}
                    />
                    {isPending && isAwaitingPayment && (
                        <Button
                            variant="pink"
                            text="Pay ticket"
                            style={{flex: 1}}
                            onPress={() =>
                                navigation.navigate("Reservation__Ticket_Payment", {ticketId: route.params.ticketId})
                            }
                        />
                    )}
                    {isPending && <Button variant="white" text="Cancel" style={{width: "100%"}} onPress={onCancel} />}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        padding: 16,
    },
    ticketContainer: {
        backgroundColor: "#128085",
        borderRadius: 12,
    },
    contentContainer: {
        padding: 16,
    },
    statusText: {
        color: "#FAFAFA",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
    },
    statusTextHighlight: {
        fontWeight: "600",
    },
    spacerSmall: {
        height: 10,
    },
    qrCodeWrapper: {
        alignItems: "center",
    },
    dividerContainer: {
        height: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    dividerLeft: {
        width: 24,
        height: 24,
        backgroundColor: "#FAFAFA",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    dividerLine: {
        flex: 1,
        borderColor: "#FAFAFA",
        borderWidth: 1,
        borderStyle: "dashed",
    },
    dividerRight: {
        width: 24,
        height: 24,
        backgroundColor: "#FAFAFA",
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    infoContainer: {
        padding: 16,
        flexDirection: "row",
    },
    infoColumn: {
        flex: 1,
    },
    labelTitle: {
        color: "#CCCBCB",
        fontSize: 12,
        fontWeight: "600",
    },
    labelValue: {
        color: "#FAFAFA",
        fontSize: 14,
        fontWeight: "600",
    },
    spacerXs: {
        height: 4,
    },
    spacerSm: {
        height: 8,
    },
    spacerMd: {
        height: 14,
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
    },
});
