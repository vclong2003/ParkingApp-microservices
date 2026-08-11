import React, {useRef} from "react";
import _ from "lodash";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {useMyParkingLot} from "./index.data";
import {Controller, useForm} from "react-hook-form";
import {TUpdateParkingLotPayload, useSubmit} from "./index.submit";
import {useEffect, useState} from "react";
import {Asset, launchCamera, launchImageLibrary} from "react-native-image-picker";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {TextInput} from "@src/components/Input__Text";
import {Button} from "@src/components/Button";
import FastImage from "react-native-fast-image";
import {useActionSheet} from "@expo/react-native-action-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useUpload} from "@src/utils/upload";
import {styles} from "./index.styles";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Camera, MapView, PointAnnotation} from "@rnmapbox/maps";
import Geolocation from "@react-native-community/geolocation";

const MAX_ALLOWED_MEDIA_COUNT = 5;
const LAT_REGEX = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
const LNG_REGEX = /^[-+]?(180(\.0+)?|((1[0-7]\d)|(\d{1,2}))(\.\d+)?)$/;

const schema = z
    .object({
        id: z.number(),
        name: z.string().min(1, {message: "Name is required"}),
        phone: z
            .string()
            .min(1, {message: "Phone is required"})
            .regex(/^\d{10,11}$/, {
                message: "Phone is invalid  (10-11 digits)",
            }),
        latitude: z.union([z.string().min(1), z.number()], {message: "Latitude is required"}),
        longitude: z.union([z.string().min(1), z.number()], {message: "Longitude is required"}),
        description: z.string().min(1, {message: "Description is required"}),
        removalMediaUrls: z.array(z.string()).optional(),
        additionalMediaUrls: z.array(z.string()).optional(),
        openAt: z.string(),
        closeAt: z.string(),
    })
    .refine(data => LAT_REGEX.test(data.latitude.toString()), {
        message: "Latitude is invalid",
        path: ["latitude"],
    })
    .refine(data => LNG_REGEX.test(data.longitude.toString()), {
        message: "Longitude is invalid",
        path: ["longitude"],
    });

type ScreenProps = {
    navigation: NavigationProp<AppStackParamList, "ParkingLot__Update">;
    route: RouteProp<AppStackParamList, "ParkingLot__Update">;
};
export function ParkingLot__Update({navigation, route}: ScreenProps) {
    const {lotId} = route.params;
    const {data: lot, isFetched} = useMyParkingLot(lotId);
    const {showActionSheetWithOptions} = useActionSheet();

    const [images, setImages] = useState<string[]>([]);
    const [removalImages, setRemovalImages] = useState<string[]>([]);
    const [additionalImages, setAdditionalImages] = useState<Asset[]>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [timeField, setTimeField] = useState<keyof TUpdateParkingLotPayload>();

    const {submit, isPending} = useSubmit();
    const {isUploading, uploadParkingLotMedia} = useUpload();
    const {
        control,
        handleSubmit,
        setValue,
        formState: {errors},
        getValues,
    } = useForm<TUpdateParkingLotPayload>({
        values: {
            id: lotId,
        },
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: TUpdateParkingLotPayload) => {
        let additionalImagePaths;
        if (additionalImages.length > 0) {
            additionalImagePaths = await uploadParkingLotMedia({
                files: additionalImages.map(image => ({uri: image.uri!, name: image.fileName!, type: image.type!})),
            });
        }

        submit({
            ...data,
            additionalMediaUrls: additionalImagePaths,
            removalMediaUrls: removalImages,
            latitude: _.toNumber(_.toString(data.latitude).replace(",", ".")),
            longitude: _.toNumber(_.toString(data.longitude).replace(",", ".")),
        });
    };

    // Map ---------------------------------------------------------------------------
    const cameraRef = useRef<Camera>(null);
    const [selectedLocation, setSelectedLocation] = useState<[number, number]>([
        getValues("longitude") || 0,
        getValues("latitude") || 0,
    ]);
    const handleMapPress = (event: any) => {
        const {geometry} = event;
        const [longitude, latitude] = geometry.coordinates;
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        setSelectedLocation([longitude, latitude]);
    };
    const setCurrentLocation = async () => {
        Geolocation.getCurrentPosition(position => {
            setValue("latitude", position.coords.latitude);
            setValue("longitude", position.coords.longitude);
            setSelectedLocation([position.coords.longitude, position.coords.latitude]);
            cameraRef.current?.flyTo([position.coords.longitude, position.coords.latitude], 1000);
        });
    };
    const updateMapMarker = () => {
        setSelectedLocation([Number(getValues("longitude")), Number(getValues("latitude"))]);
        cameraRef.current?.flyTo([Number(getValues("longitude")), Number(getValues("latitude"))], 1000);
    };
    useEffect(() => {
        if (isFetched) updateMapMarker();
    }, [isFetched]);

    // const showDatePicker = (field: keyof TUpdateParkingLotPayload) => {
    //     setTimeField(field);
    //     setDatePickerVisibility(true);
    // };
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirm = (date: Date) => {
        const formattedTime = date.toTimeString().substring(0, 5);
        if (timeField === "openAt") {
            setValue("openAt", formattedTime);
        } else if (timeField === "closeAt") {
            setValue("closeAt", formattedTime);
        }
        hideDatePicker();
    };
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
    useEffect(() => {
        if (!lot) return;

        setValue("name", lot.name);
        setValue("phone", lot.phone);
        setValue("description", lot.description);
        setValue("latitude", lot.latitude);
        setValue("longitude", lot.longitude);
        setValue("openAt", lot.openAt);
        setValue("closeAt", lot.closeAt);
        setImages([...lot.mediaUrls]);
    }, [lot, lotId]);

    return (
        <SafeAreaView>
            <Header title="Update parking lot" backButtonVisible onBackButtonPress={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.wrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() =>
                                setRemovalImages(prev =>
                                    prev.includes(image) ? prev.filter(i => i !== image) : [...prev, image],
                                )
                            }
                            style={[styles.imagePreview, {opacity: removalImages.includes(image) ? 0.5 : 1}]}>
                            <FastImage source={{uri: image}} style={styles.imagePreview} resizeMode="cover" />
                        </TouchableOpacity>
                    ))}
                    {additionalImages.map(image => (
                        <TouchableOpacity
                            key={image.uri}
                            style={[styles.imagePreview, {opacity: additionalImages.includes(image) ? 0.5 : 1}]}
                            onPress={() => setAdditionalImages(prev => prev.filter(i => i.uri !== image.uri))}>
                            <FastImage
                                source={{uri: image.uri}}
                                style={styles.imagePreview}
                                resizeMode="cover"
                                fallback
                            />
                        </TouchableOpacity>
                    ))}
                    <Button variant="gray" text="Add Image" onPress={selectOrTakeImage} />
                </ScrollView>

                {/* Name ---------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Parking Lot Name</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.name?.message}
                                placeholder="e.g. Cau Giay Parking"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                {/* Phone ---------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Contact Phone</Text>
                    <Controller
                        control={control}
                        name="phone"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.phone?.message}
                                placeholder="e.g. 0123456789"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                {/* Description ---------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Description</Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.description?.message}
                                placeholder="e.g. Cau Giay Parking"
                                value={value}
                                onChangeText={onChange}
                                multiline
                            />
                        )}
                    />
                </View>

                {/* <View style={styles.formSection}>
                    <Text style={styles.label}>Time Start Checking In</Text>
                    <Controller
                        control={control}
                        name="openAt"
                        render={({field: {value}}) => (
                            <Button
                                variant="gray"
                                text={value ? value : "Select"}
                                onPress={() => showDatePicker("openAt")}
                            />
                        )}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Time Stop Checking In</Text>
                    <Controller
                        control={control}
                        name="closeAt"
                        render={({field: {value}}) => (
                            <Button
                                variant="gray"
                                text={value ? value : "Select"}
                                onPress={() => showDatePicker("closeAt")}
                            />
                        )}
                    />
                </View> */}

                {/* Map ----------------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Location</Text>
                    <MapView style={styles.map} onPress={handleMapPress}>
                        <Camera ref={cameraRef} defaultSettings={{centerCoordinate: selectedLocation}} zoomLevel={12} />
                        <PointAnnotation id="parking-lot-location" coordinate={selectedLocation}>
                            <View style={styles.markerContainer}>
                                <View style={styles.markerDot} />
                            </View>
                        </PointAnnotation>
                    </MapView>
                    <Text style={{textAlign: "right", marginTop: 8, color: "#128085"}} onPress={setCurrentLocation}>
                        Current Location
                    </Text>
                </View>

                {/* Lat --------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Latitude</Text>
                    <Controller
                        control={control}
                        name="latitude"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.latitude?.message}
                                placeholder="e.g. 12.345"
                                value={value?.toString()}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                {/* Lng --------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Longitude</Text>
                    <Controller
                        control={control}
                        name="longitude"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.longitude?.message}
                                placeholder="e.g. 105.345345"
                                value={value?.toString()}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    <Text style={{textAlign: "right", marginTop: 8, color: "#128085"}} onPress={updateMapMarker}>
                        Show on map
                    </Text>
                </View>

                <Button
                    variant="green"
                    text={isPending || isUploading ? "Saving..." : "Update"}
                    disabled={isPending || isUploading}
                    onPress={handleSubmit(onSubmit)}
                    style={styles.submitButton}
                />
            </ScrollView>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </SafeAreaView>
    );
}
