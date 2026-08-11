import React, {useRef} from "react";
import _ from "lodash";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {Controller, useForm} from "react-hook-form";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {TCreateParkingLotPayload, useSubmit} from "./index.submit";
import {TextInput} from "@src/components/Input__Text";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useState} from "react";
import {Button} from "@src/components/Button";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {Asset, launchImageLibrary, launchCamera} from "react-native-image-picker";
import FastImage from "react-native-fast-image";
import {useUpload} from "@src/utils/upload";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {Camera, MapView, PointAnnotation} from "@rnmapbox/maps";
import Geolocation from "@react-native-community/geolocation";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const MAX_ALLOWED_MEDIA_COUNT = 5;
const LAT_REGEX = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
const LNG_REGEX = /^[-+]?(180(\.0+)?|((1[0-7]\d)|(\d{1,2}))(\.\d+)?)$/;

const schema = z
    .object({
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
        mediaUrls: z.array(z.string()).optional(),
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
    navigation: NavigationProp<AppStackParamList, "ParkingLot__Add">;
    route: RouteProp<AppStackParamList, "ParkingLot__Add">;
};

export function ParkingLot__Add({navigation}: ScreenProps) {
    const {showActionSheetWithOptions} = useActionSheet();

    const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
    const [timeField, setTimeField] = useState<keyof TCreateParkingLotPayload>();

    const {submit, isPending} = useSubmit();
    const {isUploading, uploadParkingLotMedia} = useUpload();

    // Form ---------------------------------------------------------------------------
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
    } = useForm<TCreateParkingLotPayload>({
        values: {
            name: "",
            phone: "",
            latitude: 21.052778,
            longitude: 105.817684,
            openAt: "06:00", // HH:MM
            closeAt: "22:00", // HH:MM
            mediaUrls: [],
            description: "",
        },
        resolver: zodResolver(schema),
    });
    const onSubmit = async (data: TCreateParkingLotPayload) => {
        let paths: string[] = [];
        if (selectedImages.length > 0) {
            paths = await uploadParkingLotMedia({
                files: selectedImages.map(image => ({uri: image.uri!, name: image.fileName!, type: image.type!})),
            });
        }

        submit({
            ...data,
            mediaUrls: paths,
            latitude: _.toNumber(_.toString(data.latitude).replaceAll(",", ".")),
            longitude: _.toNumber(_.toString(data.longitude).replaceAll(",", ".")),
        });
    };

    // Map ---------------------------------------------------------------------------
    const cameraRef = useRef<Camera>(null);
    const [selectedLocation, setSelectedLocation] = useState<[number, number]>([
        getValues("longitude"),
        getValues("latitude"),
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

    // const showDatePicker = (field: keyof TCreateParkingLotPayload) => {
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
                            if (assets) setSelectedImages(prev => [...prev, ...assets]);
                        },
                    );
                } else if (buttonIndex === 1) {
                    launchCamera({mediaType: "photo"}).then(({assets}) => {
                        if (assets) setSelectedImages(prev => [...prev, ...assets]);
                    });
                }
            },
        );
    };

    return (
        <SafeAreaView>
            <Header title="Add new parking lot" backButtonVisible onBackButtonPress={() => navigation.goBack()} />

            <KeyboardAwareScrollView style={styles.wrapper}>
                {/* Images --------------------------------------------------------------------------- */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                    {selectedImages.map((image, index) => (
                        <FastImage key={index} source={{uri: image.uri}} style={styles.imagePreview} />
                    ))}
                    <Button variant="gray" text="Add Image" onPress={selectOrTakeImage} />
                </ScrollView>

                {/* Name --------------------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Parking Lot Name</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.name?.message}
                                onChangeText={onChange}
                                placeholder="e.g. Long Park Cau Giay"
                                value={value}
                            />
                        )}
                    />
                </View>

                {/* Phone ----------------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Contact Phone Number</Text>
                    <Controller
                        control={control}
                        name="phone"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.phone?.message}
                                onChangeText={onChange}
                                placeholder="e.g. 0123456789"
                                value={value}
                                keyboardType="phone-pad"
                            />
                        )}
                    />
                </View>

                {/* Description ----------------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Description</Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.description?.message}
                                multiline
                                onChangeText={onChange}
                                placeholder="e.g. Long Park Cau Giay, near Cau Giay University"
                                value={value}
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
                    <Text style={{color: "#FF0000"}}>{errors.openAt?.message}</Text>
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
                    <Text style={{color: "#FF0000"}}>{errors.closeAt?.message}</Text>
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

                {/* Latitude ----------------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Latitude</Text>
                    <Controller
                        control={control}
                        name="latitude"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.latitude?.message}
                                onChangeText={onChange}
                                value={value.toString()}
                                placeholder="e.g. 10.7654321"
                                keyboardType="numeric"
                            />
                        )}
                    />
                </View>

                {/* Longitude ----------------------------------------------------------------------- */}
                <View style={styles.formSection}>
                    <Text style={styles.label}>Longitude</Text>
                    <Controller
                        control={control}
                        name="longitude"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                error={errors.longitude?.message}
                                onChangeText={onChange}
                                value={value.toString()}
                                placeholder="e.g. 106.1234567"
                                keyboardType="numeric"
                            />
                        )}
                    />
                    <Text style={{textAlign: "right", marginTop: 8, color: "#128085"}} onPress={updateMapMarker}>
                        Show on map
                    </Text>
                </View>

                <Button
                    variant="green"
                    text={isPending || isUploading ? "Saving..." : "Save"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending || isUploading}
                    style={styles.submitButton}
                />
            </KeyboardAwareScrollView>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    imageContainer: {
        flexDirection: "row",
        marginBottom: 20,
        minHeight: 100,
    },
    imagePreview: {
        width: 100,
        aspectRatio: 1,
        borderRadius: 8,
        marginRight: 10,
    },

    formSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    map: {
        height: 400,
        borderRadius: 8,
        overflow: "hidden",
    },
    markerContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    markerDot: {
        width: 20,
        height: 20,
        backgroundColor: "#128085",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    submitButton: {
        marginBottom: 32,
    },
});
