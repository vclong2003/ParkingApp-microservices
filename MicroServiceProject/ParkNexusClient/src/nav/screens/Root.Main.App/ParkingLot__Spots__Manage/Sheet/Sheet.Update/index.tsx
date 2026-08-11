import React from "react";
import {BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet";
import {forwardRef} from "react";
import {useSpotManagerContext} from "../../index.context";
import {TUpdateParkingLotSpotPayload, useDelete, useSubmit} from "./index.submit";
import {Controller, useForm} from "react-hook-form";
import {StyleSheet, Text, View} from "react-native";
import {TextInput} from "@src/components/Input__Text";
import {Button} from "@src/components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {BottomSheetBackdrop} from "@src/components/BottomSheetBackdrop";

type TExportParkingSpotSheetProps = {
    onClose: () => void;
};
export const UpdateParkingSpotSheet = forwardRef<BottomSheetModal, TExportParkingSpotSheetProps>(({onClose}, ref) => {
    const {selectedSpot, setSelectedSpot} = useSpotManagerContext();
    const {submit, isPending} = useSubmit();
    const {del, isPending: isDeleting} = useDelete();

    const isLoading = isPending || isDeleting;

    const {control, handleSubmit} = useForm<TUpdateParkingLotSpotPayload>({
        values: {
            spotId: selectedSpot!.id,
            name: selectedSpot!.name,
        },
    });

    const onSubmit = (data: TUpdateParkingLotSpotPayload) => {
        submit(data, () => {
            onClose();
            setSelectedSpot(undefined);
        });
    };
    const onDelete = () => {
        del({spotId: selectedSpot!.id}, () => {
            onClose();
            setSelectedSpot(undefined);
        });
    };

    return (
        <BottomSheetModal ref={ref} snapPoints={["40%"]} backdropComponent={BottomSheetBackdrop} onDismiss={onClose}>
            <BottomSheetView style={styles.container}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Update Parking Spot</Text>

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
                        text="Update"
                        variant="green"
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        style={styles.button}
                    />

                    <Button
                        text="Delete"
                        variant="pink"
                        onPress={onDelete}
                        disabled={isLoading}
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
