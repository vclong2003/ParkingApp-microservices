import React from "react";
import _ from "lodash";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {usePriceManagerContext} from "../index.context";
import {useMyParkingLotDetail} from "./index.data";
import {ScrollView} from "react-native-gesture-handler";
import {StyleSheet, Text, View} from "react-native";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useRef} from "react";
import {Header} from "@src/components/Header";
import {useNavigation} from "@react-navigation/native";
import {AddPriceSheet} from "../Sheet/index.addPriceSheet";
import {Button} from "@src/components/Button";
import dayjs from "dayjs";

export function List() {
    const navigation = useNavigation();
    const {lotId} = usePriceManagerContext();
    const {lot} = useMyParkingLotDetail(lotId);

    const sheetRef = useRef<BottomSheetModal>(null);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Parking Lot Prices" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
            <ScrollView style={styles.scrollView}>
                {lot?.parkingLotPrices.map((price, index) => (
                    <View key={index} style={styles.priceItem}>
                        <Text style={styles.priceItemText}>
                            Vehicle type: {_.startCase(_.toLower(price.vehicleType))}
                        </Text>
                        <Text style={styles.priceItemText}>
                            Price per hour: <Text style={styles.priceText}>${price.price}</Text>
                        </Text>
                        <Text style={styles.priceItemText}>
                            Updated at: {dayjs(price.updatedAt).format("HH:mm MMMM DD YYYY")}
                        </Text>
                    </View>
                ))}
            </ScrollView>
            <Button
                variant="green"
                style={styles.addButton}
                text="Add Price"
                onPress={() => sheetRef.current?.present()}
            />
            <AddPriceSheet ref={sheetRef} onClose={() => sheetRef.current?.dismiss()} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    priceItem: {
        backgroundColor: "#f7f7f7",
        padding: 14,
        borderRadius: 8,
        marginBottom: 8,
        gap: 8,
    },
    priceItemText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#3c3c3c",
    },
    priceText: {color: "#128085"},
    addButton: {
        margin: 16,
    },
});
