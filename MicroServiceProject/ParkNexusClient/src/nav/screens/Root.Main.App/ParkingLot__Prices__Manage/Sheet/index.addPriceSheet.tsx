import React from "react";
import {forwardRef} from "react";
import {BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet";
import {Controller, useForm} from "react-hook-form";
import {TUpdateParkingLotPricePayload, useSubmitPrice} from "./index.submit";
import {TextInput} from "@src/components/Input__Text";
import {usePriceManagerContext} from "../index.context";
import {Button} from "@src/components/Button";
import {Picker} from "@react-native-picker/picker";
import {VEHICLE__TYPE_ALIAS} from "@parknexus/api/prisma/client";
import {StyleSheet, Text} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {BottomSheetBackdrop} from "@src/components/BottomSheetBackdrop";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const schema = z.object({
    parkingLotId: z.number(),
    price: z.union([
        z.number().min(0.1, {message: "Price must be greater than 0"}),
        z
            .string()
            .transform(val => parseFloat(val))
            .refine(val => !isNaN(val) && val > 0, {message: "Price must be a valid number greater than 0"}),
    ]),
    vehicleType: z.nativeEnum(VEHICLE__TYPE_ALIAS),
});

type TExportPriceSheetProps = {
    onClose: () => void;
};
export const AddPriceSheet = forwardRef<BottomSheetModal, TExportPriceSheetProps>(({onClose}, ref) => {
    const {lotId} = usePriceManagerContext();
    const {submitPrice, isPending} = useSubmitPrice();
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<TUpdateParkingLotPricePayload>({
        values: {
            parkingLotId: lotId,
            price: 0,
            vehicleType: "CAR",
        },
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: TUpdateParkingLotPricePayload) => {
        submitPrice({...data, price: Number(String(data.price).replaceAll(",", "."))}, onClose);
    };

    return (
        <BottomSheetModal ref={ref} snapPoints={["65%"]} enablePanDownToClose backdropComponent={BottomSheetBackdrop}>
            <BottomSheetView style={styles.container}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    {/* Vehicle Type ---------------------------------------- */}
                    <Text style={[styles.label, {marginBottom: 0}]}>Vehicle Type</Text>
                    <Controller
                        control={control}
                        name="vehicleType"
                        render={({field: {onChange, value}}) => (
                            <Picker selectedValue={value} onValueChange={onChange} mode="dialog" style={styles.picker}>
                                <Picker.Item label="Car" value={VEHICLE__TYPE_ALIAS.CAR} />
                                <Picker.Item label="Motorcycle" value={VEHICLE__TYPE_ALIAS.MOTORCYCLE} />
                                <Picker.Item label="Truck" value={VEHICLE__TYPE_ALIAS.TRUCK} />
                            </Picker>
                        )}
                    />

                    {/* Price ---------------------------------------- */}
                    <Text style={styles.label}>Price per hour (USD)</Text>
                    <Controller
                        control={control}
                        name="price"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.price?.message}
                                placeholder="Price"
                                value={value.toString()}
                                onChangeText={onChange}
                                keyboardType="numeric"
                            />
                        )}
                    />

                    <Button
                        variant="green"
                        text={isPending ? "Saving..." : "Save"}
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                        disabled={isPending}
                    />
                </KeyboardAwareScrollView>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    label: {fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#3c3c3c"},
    picker: {marginBottom: 16},
    button: {marginTop: 16, marginBottom: 16},
});
