import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import React, {useEffect} from "react";
import {usePayoutHistory, useStripeConnectUrl} from "./index.data";
import {ScrollView} from "react-native-gesture-handler";
import {Button} from "@src/components/Button";
import {AppState, AppStateStatus, Linking, StyleSheet, Text, View} from "react-native";
import dayjs from "dayjs";
import {useNavigation} from "@react-navigation/native";

export function Settings__Payout() {
    const navigation = useNavigation();
    const {url, isFetching, refetch} = useStripeConnectUrl();
    const {payouts} = usePayoutHistory();

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                console.log("App has come to the foreground. Refetching data...");
                refetch();
            }
        });
        return () => subscription.remove();
    }, [refetch]);

    return (
        <SafeAreaView>
            <Header title="Payout" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <Button
                    disabled={isFetching}
                    variant="gray"
                    text={isFetching ? "Getting Stripe Connect Link..." : "Open Stripe Connect"}
                    onPress={() => {
                        if (url) Linking.openURL(url);
                    }}
                />
                <Text style={styles.sectionTitle}>Payout History</Text>
                <ScrollView contentContainerStyle={styles.historyList}>
                    {payouts.map(payout => (
                        <View key={payout.id} style={styles.payoutCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.lotName}>{payout.parkingLot.name}</Text>
                                <Text
                                    style={[
                                        styles.status,
                                        {color: payout.status === "COMPLETED" ? "#28A745" : "#DC3545"},
                                    ]}>
                                    {payout.status}
                                </Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Text style={styles.label}>Transfer ID:</Text>
                                <Text style={styles.value}>{payout.transferId || "N/A"}</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Text style={styles.label}>Net Amount:</Text>
                                <Text style={styles.value}>${payout.totalNetInUsd.toFixed(2)}</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Text style={styles.label}>Fee:</Text>
                                <Text style={styles.value}>${payout.totalFeeInUsd.toFixed(2)}</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Text style={styles.label}>Created At:</Text>
                                <Text style={styles.value}>{dayjs(payout.createdAt).format("HH:mm MMM DD, YYYY")}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginVertical: 12,
        color: "#333",
    },
    historyList: {
        gap: 16,
    },
    payoutCard: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    lotName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#128085",
    },
    status: {
        fontSize: 14,
        fontWeight: "600",
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
    },
    value: {
        fontSize: 14,
        fontWeight: "400",
        color: "#333",
    },
});
