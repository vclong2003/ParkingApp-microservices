/* eslint-disable react/no-unstable-nested-components */
import React from "react";
import {BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet";
import {forwardRef} from "react";
import {useSpotManagerContext} from "../../index.context";
import {useTicketDetail} from "./index.data";
import {BottomSheetBackdrop} from "@src/components/BottomSheetBackdrop";
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import dayjs from "dayjs";

export type TTicketSheetProps = {
    onClose: () => void;
};
export const TicketSheet = forwardRef<BottomSheetModal, TTicketSheetProps>(({onClose}, ref) => {
    const {selectedReservedSpotId} = useSpotManagerContext();
    const {ticket, isFetching} = useTicketDetail(selectedReservedSpotId);

    const InfoRow = ({label, value}: {label: string; value: string | number | undefined}) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value || ""}</Text>
        </View>
    );

    return (
        <BottomSheetModal ref={ref} snapPoints={["60%"]} backdropComponent={BottomSheetBackdrop} onDismiss={onClose}>
            <BottomSheetView>
                {ticket && !isFetching ? (
                    <ScrollView>
                        {/* Ticket Information ----------------------------------------------------- */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ticket Information</Text>
                            <InfoRow label="Owner Name" value={ticket.user.firstName + " " + ticket.user.lastName} />
                            <InfoRow label="Owner Phone" value={ticket.user.phone} />
                            <InfoRow label="Created At" value={dayjs(ticket.createdAt).format("MMM D, YYYY HH:mm")} />
                            <InfoRow label="Start Time" value={dayjs(ticket.startTime).format("MMM D, YYYY HH:mm")} />
                            <InfoRow label="End Time" value={dayjs(ticket.endTime).format("MMM D, YYYY HH:mm")} />
                        </View>

                        {/* Payment Information ----------------------------------------------------- */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Payment Information</Text>
                            <InfoRow label="Amount (USD)" value={`$${ticket.paymentRecord?.amountInUsd || "0"}`} />
                            <InfoRow
                                label="Payment Date"
                                value={dayjs(ticket.paymentRecord?.createdAt).format("MMM D, YYYY HH:mm")}
                            />
                        </View>

                        {/* Vehicle Information ------------------------------------------------------ */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Vehicle Information</Text>
                            <InfoRow label="Plate" value={ticket.vehicle.plate} />
                            <InfoRow label="Brand" value={ticket.vehicle.brand} />
                            <InfoRow label="Model" value={ticket.vehicle.model} />
                            <InfoRow label="Color" value={ticket.vehicle.color} />
                        </View>

                        {/* Services --------------------------------------------------------------- */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Services</Text>
                            {ticket.services?.map(service => (
                                <View key={service.id} style={styles.serviceContainer}>
                                    <Text style={styles.serviceName}>{service.name}</Text>
                                    <Text style={styles.serviceDescription}>{service.description}</Text>
                                    <Text style={styles.servicePrice}>${service.price}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                ) : (
                    <ActivityIndicator />
                )}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    section: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: 14,
        color: "#555",
    },
    infoValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#5c5c5c",
    },
    imageContainer: {
        flexDirection: "row",
        marginTop: 8,
    },

    serviceContainer: {
        padding: 8,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4e4e4e",
    },
    serviceDescription: {
        fontSize: 14,
        color: "#666",
        marginVertical: 4,
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#128085",
    },
});
