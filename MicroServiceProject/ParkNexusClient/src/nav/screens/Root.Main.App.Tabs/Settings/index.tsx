import React from "react";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {ScrollView, StyleSheet, Text, View} from "react-native";

import ListBulletSvg from "@src/static/svgs/ListBullet.svg";
import FastImage from "react-native-fast-image";
import {Button} from "@src/components/Button";

import {useMe} from "./index.data";
import {useAuthStore} from "@src/states";
import {AuthStorage} from "@src/auth/auth.utils";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";

import AvatarPlaceHolder from "@src/static/images/Profile.png";
import CaretRightBlackSvg from "@src/static/svgs/CaretRightBlack.svg";
import StripeSvg from "@src/static/svgs/Stripe.svg";
import BellSvg from "@src/static/svgs/BellBlack.svg";
import CardBlackSvg from "@src/static/svgs/CardBlack.svg";
import GarageBlackSvg from "@src/static/svgs/GarageBlack.svg";
import {useQueryClient} from "@tanstack/react-query";

export function Settings() {
    const {me} = useMe();
    const queryClient = useQueryClient();
    const {setIsAuthenticated} = useAuthStore();
    const {navigate} = useNavigation<NavigationProp<AppStackParamList>>();

    const logout = async () => {
        queryClient.clear();
        await AuthStorage.clearAuthStorage();
        setIsAuthenticated(false);
    };

    return (
        <SafeAreaView>
            <Header title="Settings" rightButtonIcon={<ListBulletSvg width={24} height={24} />} />
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={{height: 8}} />
                <View style={styles.accountWrapper}>
                    <FastImage
                        source={me?.avatarUrl ? {uri: me?.avatarUrl} : AvatarPlaceHolder}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                    <View style={styles.accountTextsWrapper}>
                        <Text style={styles.userNameText}>
                            {me?.firstName} {me?.lastName}
                        </Text>
                        <Text style={styles.userInfoText}>{me?.account?.email}</Text>
                    </View>
                    <Button
                        variant="gray"
                        preIcon={<CaretRightBlackSvg width={16} height={16} />}
                        style={styles.button}
                        onPress={() => navigate("Settings__Profile_Update")}
                    />
                </View>
                <View style={{height: 32}} />
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={{height: 8}} />
                <ScrollView style={styles.settingListWrapper}>
                    {/* Vehicle List -------------------------------------------------- */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingItemRow}>
                            <GarageBlackSvg width={24} height={24} />
                            <Text style={styles.settingItemText}>My Vehicles</Text>
                        </View>
                        <Button
                            variant="gray"
                            preIcon={<CaretRightBlackSvg width={16} height={16} />}
                            style={styles.button}
                            onPress={() => navigate("Settings__Vehicle_List")}
                        />
                    </View>

                    {/* Card List -------------------------------------------------- */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingItemRow}>
                            <CardBlackSvg width={24} height={24} />
                            <Text style={styles.settingItemText}>My Cards</Text>
                        </View>
                        <Button
                            variant="gray"
                            preIcon={<CaretRightBlackSvg width={16} height={16} />}
                            style={styles.button}
                            onPress={() => navigate("Settings__SavedCards_List")}
                        />
                    </View>

                    {/* Notification ------------------------------------------------ */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingItemRow}>
                            <BellSvg width={24} height={24} />
                            <Text style={styles.settingItemText}>Notification</Text>
                        </View>
                        <Button
                            variant="gray"
                            preIcon={<CaretRightBlackSvg width={16} height={16} />}
                            style={styles.button}
                            onPress={() => navigate("Settings__Notification")}
                        />
                    </View>

                    {/* Payout ------------------------------------------------------ */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingItemRow}>
                            <StripeSvg width={36} height={36} />
                            <Text style={styles.settingItemText}>Payout</Text>
                        </View>
                        <Button
                            variant="gray"
                            preIcon={<CaretRightBlackSvg width={16} height={16} />}
                            style={styles.button}
                            onPress={() => navigate("Settings__Payout")}
                        />
                    </View>
                </ScrollView>
            </View>
            <Button variant="gray" text="Log out" style={styles.logoutButton} onPress={logout} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 16,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
    },

    button: {
        width: 36,
        height: 36,
    },

    accountWrapper: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 55 / 2,
    },
    accountTextsWrapper: {
        flex: 1,
        flexDirection: "column",
        marginHorizontal: 10,
        gap: 6,
    },
    userNameText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#128085",
    },
    userInfoText: {
        fontSize: 12,
        fontWeight: "400",
        color: "#000",
    },

    settingListWrapper: {
        flexDirection: "column",
        flex: 1,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 12,
        backgroundColor: "#F6F6F6",
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 8,
        marginBottom: 8,
    },
    settingItemRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8, // Add spacing between the text and the icon
    },
    settingItemText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },

    logoutButton: {
        position: "absolute",
        bottom: 120,
        left: 16,
        right: 16,
    },
});
