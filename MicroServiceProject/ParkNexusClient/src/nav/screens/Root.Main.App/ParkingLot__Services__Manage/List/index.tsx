import React from "react";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {useServiceManagerContext} from "../index.context";
import {useMyParkingLotDetail} from "./index.data";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useRef} from "react";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {AddServiceSheet} from "../Sheet/Sheet.Add";
import {Button} from "@src/components/Button";
import {useNavigation} from "@react-navigation/native";
import {UpdateServiceSheet} from "../Sheet/Sheet.Update";
import {ScrollView} from "react-native-gesture-handler";
import dayjs from "dayjs";

export function List() {
    const navigation = useNavigation();
    const {lotId, setSelectedServiceId, selectedServiceId} = useServiceManagerContext();
    const {lot} = useMyParkingLotDetail(lotId);

    const addSheetRef = useRef<BottomSheetModal>(null);
    const updateSheetRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        if (selectedServiceId) {
            updateSheetRef.current?.present();
        }
    }, [selectedServiceId]);

    return (
        <SafeAreaView>
            <Header title="Services" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollView}>
                {lot?.parkingLotServices.map((service, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedServiceId(service.id)}
                        style={styles.serviceCard}>
                        <View style={styles.serviceDetail}>
                            <Text style={styles.label}>Name:</Text>
                            <Text style={styles.value}>{service.name}</Text>
                        </View>
                        <View style={styles.serviceDetail}>
                            <Text style={styles.label}>Price:</Text>
                            <Text style={styles.value}>{service.price}</Text>
                        </View>
                        <View style={styles.serviceDetail}>
                            <Text style={styles.label}>Type:</Text>
                            <Text style={styles.value}>{service.type}</Text>
                        </View>
                        <View style={styles.serviceDetail}>
                            <Text style={styles.label}>Vehicle Types:</Text>
                            <Text style={styles.value}>{service.vehicleTypes.join(", ")}</Text>
                        </View>
                        <View style={styles.serviceDetail}>
                            <Text style={styles.label}>Description:</Text>
                            <Text style={styles.value}>{service.description}</Text>
                        </View>
                        <View style={styles.serviceDetail}>
                            <Text style={styles.label}>Updated at:</Text>
                            <Text style={styles.value}>{dayjs(service.updatedAt).format("HH:mm MMMM DD YYYY")}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Button
                variant="green"
                text="Add Service"
                onPress={() => addSheetRef.current?.present()}
                style={styles.addButton}
            />
            <AddServiceSheet ref={addSheetRef} onClose={() => addSheetRef.current?.dismiss()} />
            {selectedServiceId && (
                <UpdateServiceSheet ref={updateSheetRef} onClose={() => updateSheetRef.current?.dismiss()} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {padding: 16},
    serviceCard: {
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    serviceDetail: {flexDirection: "row", marginBottom: 8},
    label: {fontSize: 14, fontWeight: "600", flex: 1},
    value: {flex: 2, fontSize: 14},
    addButton: {margin: 16},
});
