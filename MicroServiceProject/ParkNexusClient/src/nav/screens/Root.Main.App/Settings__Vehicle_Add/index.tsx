import React from "react";
import * as z from "zod";
import {useNavigation} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {TAddVehiclePayload, useSubmit} from "./index.submit";
import {Controller, useForm} from "react-hook-form";
import {VEHICLE__TYPE_ALIAS} from "@parknexus/api/prisma/client";
import {useState} from "react";
import {Asset, launchImageLibrary} from "react-native-image-picker";
import {useUpload} from "@src/utils/upload";
import {Dimensions, Text, TouchableWithoutFeedback, View} from "react-native";
import {TextInput} from "@src/components/Input__Text";
import {Picker} from "@react-native-picker/picker";
import {Button} from "@src/components/Button";
import {zodResolver} from "@hookform/resolvers/zod";

import FastImage from "react-native-fast-image";
import {styles} from "./index.styles";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";

const deviceWidth = Dimensions.get("window").width;

const schema = z.object({
    plate: z.string().min(4, "Please enter a valid plate number"),
    brand: z.string().min(3, "Please enter a valid brand"),
    color: z.string().min(3, "Please enter a valid color"),
    model: z.string().min(3, "Please enter a valid model"),
    type: z.nativeEnum(VEHICLE__TYPE_ALIAS),
});

export function Settings__Vehicle_Add() {
    const navigation = useNavigation();

    const [selectedImage, setSelectedImage] = useState<Asset>();

    const {uploadVehicleImage, isUploading} = useUpload();
    const {submit, isPending} = useSubmit();
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<TAddVehiclePayload>({
        values: {
            plate: "",
            brand: "",
            color: "",
            model: "",
            type: VEHICLE__TYPE_ALIAS.CAR,
        },
        resolver: zodResolver(schema),
    });

    const openImagePicker = () => {
        launchImageLibrary({mediaType: "photo", selectionLimit: 1}).then(async ({assets}) => {
            const asset = assets?.[0];
            if (!asset?.uri) return;
            setSelectedImage(asset);
        });
    };

    const onSubmit = async (data: TAddVehiclePayload) => {
        if (!selectedImage) return Toast.show({type: "error", text1: "Please select an image"});
        let imageUrl: string | undefined;
        if (selectedImage) {
            imageUrl = await uploadVehicleImage({
                file: {
                    uri: selectedImage.uri!,
                    name: selectedImage.fileName!,
                    type: selectedImage.type!,
                },
            });
        }
        submit({...data, imageUrl});
    };

    return (
        <SafeAreaView>
            <Header title="Add Vehicle" onBackButtonPress={() => navigation.goBack()} backButtonVisible />
            <KeyboardAwareScrollView style={styles.wrapper}>
                <View style={{height: 8}} />
                {selectedImage && (
                    <TouchableWithoutFeedback onPress={openImagePicker}>
                        <FastImage
                            source={{uri: selectedImage.uri}}
                            style={{width: deviceWidth - 16 * 2, height: (deviceWidth / 16) * 9, borderRadius: 8}}
                            resizeMode="cover"
                            fallback
                        />
                    </TouchableWithoutFeedback>
                )}
                <View style={{height: 8}} />
                {!selectedImage && (
                    <Button variant="gray" text="Select an image" onPress={openImagePicker} disabled={isUploading} />
                )}

                {/* Type ----------------------------------- */}
                <View style={{height: 8}} />
                <Text style={styles.vehicleTypeLabel}>Vehicle type</Text>
                <Controller
                    control={control}
                    name="type"
                    render={({field: {onChange, value}}) => (
                        <Picker selectedValue={value} onValueChange={onChange} mode="dialog">
                            <Picker.Item label="Car" value={VEHICLE__TYPE_ALIAS.CAR} />
                            <Picker.Item label="Motorcycle" value={VEHICLE__TYPE_ALIAS.MOTORCYCLE} />
                            <Picker.Item label="Truck" value={VEHICLE__TYPE_ALIAS.TRUCK} />
                        </Picker>
                    )}
                />

                {/* Plate ----------------------------------- */}
                <View style={{height: 8}} />
                <Text style={styles.formFieldLabel}>Plate number</Text>
                <Controller
                    rules={{required: true, minLength: 4}}
                    control={control}
                    name="plate"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            placeholder="e.g. FL-029-RF"
                            error={errors.plate?.message}
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />

                {/* Brand ----------------------------------- */}
                <View style={{height: 8}} />
                <Text style={styles.formFieldLabel}>Brand</Text>
                <Controller
                    control={control}
                    name="brand"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            error={errors.brand?.message}
                            placeholder="e.g. Ford"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />

                {/* Model ----------------------------------- */}
                <View style={{height: 8}} />
                <Text style={styles.formFieldLabel}>Model</Text>
                <Controller
                    control={control}
                    name="model"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            error={errors.model?.message}
                            placeholder="e.g. F-150"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />

                {/* Color ----------------------------------- */}
                <View style={{height: 8}} />
                <Text style={styles.formFieldLabel}>Color</Text>
                <Controller
                    control={control}
                    name="color"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            error={errors.color?.message}
                            placeholder="e.g. Red"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />

                <Button
                    variant="green"
                    text={isPending || isUploading ? "Saving..." : "Save"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending || isUploading}
                    style={styles.saveButton}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
