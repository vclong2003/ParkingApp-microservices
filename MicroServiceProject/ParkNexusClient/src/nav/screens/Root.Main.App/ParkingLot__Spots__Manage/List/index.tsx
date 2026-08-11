import React from "react";
import {useNavigation} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {useMyParkingLotDetail} from "./index.data";
import {useSpotManagerContext} from "../index.context";
import {Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useRef} from "react";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {AddParkingSpotSheet} from "../Sheet/Sheet.Add";
import {UpdateParkingSpotSheet} from "../Sheet/Sheet.Update";

import CarTealSvg from "@src/static/svgs/CarTeal.svg";
import MotorcycleTealSvg from "@src/static/svgs/MotorcycleTeal.svg";
import TruckTealSvg from "@src/static/svgs/TruckTeal.svg";
import PlusTealSvg from "@src/static/svgs/PlusTeal.svg";
import NotePencilTealSvg from "@src/static/svgs/NotePencilTeal.svg";
import {TicketSheet} from "../Sheet/Sheet.Ticket";

export function List() {
    const navigation = useNavigation();
    const {lotId, selectedSpot, setSelectedSpot, setSelectedReservedSpotId, selectedReservedSpotId} =
        useSpotManagerContext();
    const {lot, refetch, isFetching} = useMyParkingLotDetail(lotId);

    const addSheetRef = useRef<BottomSheetModal>(null);
    const updateSheetRef = useRef<BottomSheetModal>(null);
    const ticketSheerRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        if (selectedSpot) {
            updateSheetRef.current?.present();
        }
    }, [selectedSpot]);
    useEffect(() => {
        if (selectedReservedSpotId) {
            ticketSheerRef.current?.present();
        }
    }, [selectedReservedSpotId]);

    const renderVehicleIcon = (type: string) => {
        switch (type) {
            case "CAR":
                return <CarTealSvg width={28} height={28} />;
            case "MOTORCYCLE":
                return <MotorcycleTealSvg width={28} height={28} />;
            case "TRUCK":
                return <TruckTealSvg width={28} height={28} />;
            default:
                return null;
        }
    };

    const renderSummary = () => {
        const summary = {
            CAR: {total: 0, available: 0},
            MOTORCYCLE: {total: 0, available: 0},
            TRUCK: {total: 0, available: 0},
        };

        lot?.parkingSpots.forEach(spot => {
            if (summary[spot.vehicleType]) {
                summary[spot.vehicleType].total += 1;
                if (spot.isAvailable) {
                    summary[spot.vehicleType].available += 1;
                }
            }
        });

        return (
            <View style={styles.summaryContainer}>
                {Object.entries(summary).map(([type, data]) => (
                    <View key={type} style={styles.summaryItem}>
                        {renderVehicleIcon(type)}
                        <Text style={styles.summaryText}>
                            {data.available}/{data.total}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView>
            <Header title="Parking spots" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
            {renderSummary()}
            <ScrollView contentContainerStyle={styles.gridContainer}>
                <RefreshControl refreshing={isFetching} onRefresh={refetch} style={{position: "absolute"}} />
                {lot?.parkingSpots.map(spot => (
                    <Pressable
                        onPress={() => {
                            if (!spot.isAvailable) setSelectedReservedSpotId(spot.id);
                        }}
                        key={spot.id}
                        style={[styles.spotCard, spot.isAvailable ? styles.available : styles.notAvailable]}>
                        <Pressable
                            onPress={() => setSelectedSpot(spot)}
                            style={{position: "absolute", width: 20, height: 20, right: 4, top: 4}}>
                            <NotePencilTealSvg width={20} height={20} />
                        </Pressable>
                        <View style={styles.iconContainer}>{renderVehicleIcon(spot.vehicleType)}</View>
                        <Text style={styles.spotName}>{spot.name}</Text>
                    </Pressable>
                ))}
                <TouchableOpacity style={styles.addCard} onPress={() => addSheetRef.current?.present()}>
                    <PlusTealSvg width={36} height={36} />
                </TouchableOpacity>
            </ScrollView>
            <AddParkingSpotSheet ref={addSheetRef} onClose={() => addSheetRef.current?.dismiss()} />
            {!!selectedReservedSpotId && (
                <TicketSheet
                    ref={ticketSheerRef}
                    onClose={() => {
                        setSelectedReservedSpotId(undefined);
                        ticketSheerRef.current?.dismiss();
                    }}
                />
            )}
            {!!selectedSpot && (
                <UpdateParkingSpotSheet
                    ref={updateSheetRef}
                    onClose={() => {
                        setSelectedSpot(undefined);
                        updateSheetRef.current?.dismiss();
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginVertical: 6,
        alignItems: "center",
    },
    summaryItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    summaryText: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
        color: "#333",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 12,
        gap: 8,
    },
    spotCard: {
        width: 80,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        backgroundColor: "#f7f7f7",
        borderWidth: 1,
        borderColor: "#d9d9d9",
        position: "relative",
    },
    available: {
        backgroundColor: "#e0f7fa",
        borderColor: "#128085",
    },
    notAvailable: {
        backgroundColor: "#fdecea",
        borderColor: "#d93025",
    },
    iconContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    spotName: {
        fontSize: 12,
        fontWeight: "500",
        color: "#333",
        position: "absolute",
        bottom: 8,
    },
    addCard: {
        width: 80,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        backgroundColor: "#ededed",
    },
    addText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
});
