import React from "react";
import {BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet";
import {forwardRef, useEffect, useState} from "react";
import {ScrollView} from "react-native-gesture-handler";
import {useServiceManagerContext} from "../../index.context";
import {Controller, useForm} from "react-hook-form";
import {TUpdateParkingLotServicePayload, useDelete, useSubmit} from "./index.submit";
import {useParkingLotService} from "./index.data";
import {Asset, launchCamera, launchImageLibrary} from "react-native-image-picker";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import {Button} from "@src/components/Button";
import {InputMultipleSelect} from "@src/components/Input__MultipleSelect";
import {Picker} from "@react-native-picker/picker";
import {PARKING_LOT_SERVICE__TYPE_ALIAS, VEHICLE__TYPE_ALIAS} from "@parknexus/api/prisma/client";
import {TextInput} from "@src/components/Input__Text";
import {useUpload} from "@src/utils/upload";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {BottomSheetBackdrop} from "@src/components/BottomSheetBackdrop";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const MAX_ALLOWED_MEDIA_COUNT = 5;

const schema = z.object({
    serviceId: z.number(),
    name: z.string().min(1, {message: "Name is required"}),
    type: z.nativeEnum(PARKING_LOT_SERVICE__TYPE_ALIAS),
    vehicleTypes: z.array(z.nativeEnum(VEHICLE__TYPE_ALIAS)).min(1, {message: "Vehicle types is required"}),
    description: z.string().min(1, {message: "Description is required"}),
    price: z.union([
        z.number().min(0.1, {message: "Price must be greater than 0"}),
        z
            .string()
            .transform(val => parseFloat(val))
            .refine(val => !isNaN(val) && val > 0, {message: "Price must be a valid number greater than 0"}),
    ]),
    additionalMediaUrls: z.array(z.string()).optional(),
    removalMediaUrls: z.array(z.string()).optional(),
});

type TExportServiceSheetProps = {
    onClose: () => void;
};
export const UpdateServiceSheet = forwardRef<BottomSheetModal, TExportServiceSheetProps>(({onClose}, ref) => {
    const {selectedServiceId, setSelectedServiceId} = useServiceManagerContext();
    const {service} = useParkingLotService();
    const {showActionSheetWithOptions} = useActionSheet();
    const {uploadParkingLotServiceMedia, isUploading} = useUpload();
    const {submit, isPending} = useSubmit();
    const {del, isPending: isDeleting} = useDelete();

    const isLoading = isPending || isDeleting || isUploading;

    const [images, setImages] = useState<string[]>([]);
    const [removalImages, setRemovalImages] = useState<string[]>([]);
    const [additionalImages, setAdditionalImages] = useState<Asset[]>([]);

    const {
        setValue,
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<TUpdateParkingLotServicePayload>({
        values: {
            serviceId: selectedServiceId!,
        },
        resolver: zodResolver(schema),
    });

    const selectOrTakeImage = () => {
        showActionSheetWithOptions(
            {
                options: ["Select from library", "Take photo", "Cancel"],
                cancelButtonIndex: 2,
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    launchImageLibrary({mediaType: "photo", selectionLimit: MAX_ALLOWED_MEDIA_COUNT}).then(
                        ({assets}) => {
                            if (assets) setAdditionalImages(prev => [...prev, ...assets]);
                        },
                    );
                } else if (buttonIndex === 1) {
                    launchCamera({mediaType: "photo"}).then(({assets}) => {
                        if (assets) setAdditionalImages(prev => [...prev, ...assets]);
                    });
                }
            },
        );
    };

    const onSubmit = async (data: TUpdateParkingLotServicePayload) => {
        let additionalImagePaths;
        if (additionalImages.length > 0) {
            additionalImagePaths = await uploadParkingLotServiceMedia({
                files: additionalImages.map(image => ({uri: image.uri!, name: image.fileName!, type: image.type!})),
            });
        }
        submit(
            {
                ...data,
                additionalMediaUrls: additionalImagePaths,
                removalMediaUrls: removalImages,
                price: Number(String(data.price).replaceAll(",", ".")),
            },
            () => {
                onClose();
                setSelectedServiceId(undefined);
            },
        );
    };
    const onDelete = () => {
        del({serviceId: selectedServiceId!}, () => {
            onClose();
            setSelectedServiceId(undefined);
        });
    };

    useEffect(() => {
        if (!service) return;
        setValue("name", service.name);
        setValue("type", service.type);
        setValue("description", service.description);
        setValue("price", service.price);
        setValue("type", service.type);
        setValue("vehicleTypes", service.vehicleTypes);
        setImages(service.mediaUrls);
    }, [selectedServiceId, service]);

    return (
        <BottomSheetModal
            ref={ref}
            enablePanDownToClose
            snapPoints={["85%"]}
            backdropComponent={BottomSheetBackdrop}
            onDismiss={() => setSelectedServiceId(undefined)}>
            <BottomSheetView style={styles.container}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                        {images.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() =>
                                    setRemovalImages(prev =>
                                        prev.includes(image) ? prev.filter(i => i !== image) : [...prev, image],
                                    )
                                }
                                style={{opacity: removalImages.includes(image) ? 0.5 : 1}}>
                                <FastImage source={{uri: image}} style={styles.image} resizeMode="cover" fallback />
                            </TouchableOpacity>
                        ))}
                        {additionalImages.map(image => (
                            <TouchableOpacity
                                key={image.uri}
                                onPress={() => setAdditionalImages(prev => prev.filter(i => i.uri !== image.uri))}>
                                <FastImage source={{uri: image.uri}} style={styles.image} resizeMode="cover" fallback />
                            </TouchableOpacity>
                        ))}
                        <Button variant="gray" text="Add Image" onPress={selectOrTakeImage} />
                    </ScrollView>

                    {/* Type ------------------------------------------------------ */}
                    <Text style={[styles.label, {marginBottom: 0}]}>Service Type</Text>
                    <Controller
                        control={control}
                        name="type"
                        render={({field: {onChange, value}}) => (
                            <Picker selectedValue={value} onValueChange={onChange} mode="dialog">
                                {Object.values(PARKING_LOT_SERVICE__TYPE_ALIAS).map(type => (
                                    <Picker.Item key={type} label={type} value={type} />
                                ))}
                            </Picker>
                        )}
                    />
                    <View style={{height: 8}} />

                    {/* Vehicle Types --------------------------------------------- */}
                    <Text style={styles.label}>Vehicle Types</Text>
                    <Controller
                        control={control}
                        name="vehicleTypes"
                        render={({field: {onChange, value}}) => (
                            <InputMultipleSelect
                                options={[
                                    {label: "Car", value: "CAR"},
                                    {label: "Motorcycle", value: "MOTORCYCLE"},
                                    {label: "Truck", value: "TRUCK"},
                                ]}
                                selectedOptions={value || []}
                                onChange={onChange}
                            />
                        )}
                    />
                    <Text style={{color: "red", fontSize: 12}}>{errors.vehicleTypes?.message}</Text>
                    <View style={{height: 8}} />

                    {/* Name ------------------------------------------------------ */}
                    <Text style={styles.label}>Service Name</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.name?.message}
                                placeholder="Name"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    <View style={{height: 8}} />

                    {/* Description ------------------------------------------------ */}
                    <Text style={styles.label}>Description</Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.description?.message}
                                placeholder="Description"
                                value={value}
                                onChangeText={onChange}
                                multiline
                            />
                        )}
                    />
                    <View style={{height: 8}} />

                    {/* Price ----------------------------------------------------- */}
                    <Text style={styles.label}>Price</Text>
                    <Controller
                        control={control}
                        name="price"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.price?.message}
                                placeholder="Price"
                                value={value?.toString()}
                                onChangeText={onChange}
                                keyboardType="numeric"
                            />
                        )}
                    />
                    <View style={{height: 8}} />

                    <Button
                        variant="green"
                        text={isPending || isUploading ? "Saving..." : "Save"}
                        disabled={isLoading}
                        onPress={handleSubmit(onSubmit)}
                        style={styles.submitButton}
                    />
                    <Button
                        variant="pink"
                        text="Delete"
                        disabled={isLoading}
                        onPress={onDelete}
                        style={styles.submitButton}
                    />
                    <View style={{height: 16}} />
                </KeyboardAwareScrollView>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
    imageScroll: {marginBottom: 16},
    image: {width: 100, height: 100, borderRadius: 8, marginRight: 8},
    label: {fontSize: 16, fontWeight: "600", marginBottom: 6, color: "#3f3f3f"},
    picker: {marginBottom: 16},
    submitButton: {marginBottom: 8, marginTop: 8},
});
