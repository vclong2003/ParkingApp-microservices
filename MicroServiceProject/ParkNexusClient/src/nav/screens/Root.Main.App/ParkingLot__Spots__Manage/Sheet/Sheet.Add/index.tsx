import React from "react";
import {BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet";
import {forwardRef} from "react";
import {Controller, useForm} from "react-hook-form";
import {StyleSheet, Text, View} from "react-native";
import {TAddParkingLotSpotPayload, useSubmit} from "./index.submit";
import {useSpotManagerContext} from "../../index.context";
import {VEHICLE__TYPE_ALIAS} from "@parknexus/api/prisma/client";
import {TextInput} from "@src/components/Input__Text";
import {Picker} from "@react-native-picker/picker";
import {Button} from "@src/components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {BottomSheetBackdrop} from "@src/components/BottomSheetBackdrop";

type TExportParkingSpotSheetProps = {
    onClose: () => void;
};
export const AddParkingSpotSheet = forwardRef<BottomSheetModal, TExportParkingSpotSheetProps>(({onClose}, ref) => {
    const {lotId} = useSpotManagerContext();

    const {submit, isPending} = useSubmit();

    const {control, handleSubmit} = useForm<TAddParkingLotSpotPayload>({
        values: {
            parkingLotId: lotId,
            name: "",
            vehicleType: VEHICLE__TYPE_ALIAS.CAR,
        },
    });

    const onSubmit = (data: TAddParkingLotSpotPayload) => {
        submit(data, onClose);
    };

    return (
        <BottomSheetModal ref={ref} snapPoints={["70%"]} backdropComponent={BottomSheetBackdrop}>
            <BottomSheetView style={styles.container}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Add Parking Spot</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Type</Text>
                        <Controller
                            control={control}
                            name="vehicleType"
                            render={({field: {onChange, value}}) => (
                                <Picker selectedValue={value} onValueChange={onChange}>
                                    <Picker.Item label="Car" value={VEHICLE__TYPE_ALIAS.CAR} />
                                    <Picker.Item label="Motorcycle" value={VEHICLE__TYPE_ALIAS.MOTORCYCLE} />
                                    <Picker.Item label="Truck" value={VEHICLE__TYPE_ALIAS.TRUCK} />
                                </Picker>
                            )}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Spot Name</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({field: {onChange, value}}) => (
                                <TextInput placeholder="Enter spot name" value={value} onChangeText={onChange} />
                            )}
                        />
                    </View>

                    <Button
                        text="Add"
                        variant="green"
                        onPress={handleSubmit(onSubmit)}
                        disabled={isPending}
                        style={styles.button}
                    />
                </KeyboardAwareScrollView>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#555",
        marginBottom: 8,
    },
    button: {
        marginBottom: 16,
    },
});
