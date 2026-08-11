import React from "react";
import {BottomSheetModal, BottomSheetView} from "@gorhom/bottom-sheet";
import {forwardRef, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {useCameraDevice, Camera, useCameraPermission} from "react-native-vision-camera";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {Button} from "@src/components/Button";
import {BottomSheetBackdrop} from "@src/components/BottomSheetBackdrop";

type TCheckInSheetProps = {
    onClose: () => void;
};
export const CheckInSheet = forwardRef<BottomSheetModal, TCheckInSheetProps>(({onClose}, ref) => {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const device = useCameraDevice("back");
    const deviceFront = useCameraDevice("front");
    const deviceExt = useCameraDevice("external");
    const {hasPermission} = useCameraPermission();
    const [isCameraActive, setIsCameraActive] = useState(false);

    if ((!device && !deviceFront && !deviceExt) || !hasPermission) return null;
    return (
        <BottomSheetModal ref={ref} snapPoints={["70%"]} backdropComponent={BottomSheetBackdrop} enableDismissOnClose>
            <BottomSheetView style={styles.wrapper}>
                <Text style={styles.title}>Scan customer's ticket</Text>
                <View style={styles.scannerWrapper}>
                    <View style={styles.scanner}>
                        <Camera
                            device={(device || deviceFront || deviceExt)!}
                            isActive={isCameraActive}
                            style={{width: "100%", height: "100%"}}
                            resizeMode="cover"
                            codeScanner={{
                                codeTypes: ["qr"],
                                regionOfInterest: {x: 0, y: (1920 - 1200) / 2 / 1920, width: 1, height: 1200 / 1920},
                                onCodeScanned: codes => {
                                    const code = codes[0]?.value;
                                    if (!code) return;
                                    setIsCameraActive(false);
                                    onClose();
                                    return navigation.navigate("Reservation__CICO", {ticketCode: code});
                                },
                            }}
                            onInitialized={() => setIsCameraActive(true)}
                        />
                    </View>
                </View>
                <Button variant="pink" text="Cancel" onPress={onClose} style={styles.cancelBtn} />
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
    },
    scannerWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    scanner: {borderRadius: 16, overflow: "hidden", width: 280, height: 280},
    cancelBtn: {
        marginLeft: "auto",
        marginRight: "auto",
        width: 280,
        marginBottom: 16,
    },
});
