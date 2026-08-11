import React from "react";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {Pressable, RefreshControl, ScrollView, Text, View} from "react-native";
import {styles} from "./index.styles";
import {useMyParkingLots} from "./index.data";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {Button} from "@src/components/Button";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useCameraPermission} from "react-native-vision-camera";

import PlusTealSvg from "@src/static/svgs/PlusTeal.svg";
import QrScanSvg from "@src/static/svgs/QrScan.svg";
import {useEffect, useRef} from "react";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {CheckInSheet} from "./LotManagement.CheckIn/index.sheet";

export function LotManagement() {
    const {hasPermission, requestPermission} = useCameraPermission();
    const {lots, isRefetching, refetch} = useMyParkingLots();
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const {bottom} = useSafeAreaInsets();

    const checkInSheetRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission, requestPermission]);

    return (
        <SafeAreaView>
            <Header
                title="Lot Management"
                rightButtonIcon={<PlusTealSvg width={24} height={24} />}
                onRightButtonPress={() => navigation.navigate("ParkingLot__Add")}
            />
            <View style={styles.wrapper}>
                <ScrollView style={styles.lotListWrapper}>
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                    {lots.map(lot => (
                        <Pressable
                            key={lot.id}
                            style={styles.lotItem}
                            onPress={() => navigation.navigate("ParkingLot__MyLotDetail", {lotId: lot.id})}>
                            <Text style={styles.lotName}>{lot.name}</Text>
                            <Text style={styles.lotDetails}>
                                {lot.latitude} - {lot.longitude}
                            </Text>
                            <Text style={styles.lotDetails}>{lot.status}</Text>
                            <Text
                                style={[
                                    styles.lotStatus,
                                    lot.isApproved ? styles.approvedStatus : styles.pendingStatus,
                                ]}>
                                {lot.isApproved ? "Approved" : "Not Approved"}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            {lots?.length > 0 && hasPermission && (
                <>
                    <CheckInSheet ref={checkInSheetRef} onClose={() => checkInSheetRef.current?.dismiss()} />
                    <Button
                        variant="green"
                        preIcon={<QrScanSvg width={24} height={24} />}
                        text="Scan ticket"
                        style={{position: "absolute", bottom: bottom + 100, right: 20}}
                        onPress={() => checkInSheetRef.current?.present()}
                    />
                </>
            )}
        </SafeAreaView>
    );
}
