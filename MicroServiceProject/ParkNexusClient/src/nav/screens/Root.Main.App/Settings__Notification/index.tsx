import {useNavigation} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useNotifications} from "./index.data";
import dayjs from "dayjs";

export function Settings__Notification() {
    const navigation = useNavigation();
    const {notifications} = useNotifications();

    return (
        <SafeAreaView>
            <Header title="Notifications" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.container}>
                {notifications && notifications.length > 0 ? (
                    notifications.map(notification => (
                        <View key={notification.id} style={styles.notificationCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.title}>{notification.title}</Text>
                                <Text style={styles.timestamp}>
                                    {dayjs(notification.createdAt).format("HH:mm MMM DD, YYYY")}
                                </Text>
                            </View>
                            <Text style={styles.message}>{notification.message}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    notificationCard: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#128085",
    },
    timestamp: {
        fontSize: 12,
        color: "#888",
    },
    message: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
    },
});
