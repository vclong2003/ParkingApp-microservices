import {NavigationProp, RouteProp} from "@react-navigation/native";
import {Button} from "@src/components/Button";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {AuthStackParamList} from "@src/nav/navigators/Root.Main.Auth";
import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {OtpInput} from "react-native-otp-entry";
import {LogBox} from "react-native";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

type ScreenProps = {
    navigation: NavigationProp<AuthStackParamList, "Verification">;
    route: RouteProp<AuthStackParamList, "Verification">;
};

export function Verification({navigation, route}: ScreenProps) {
    const {onVerify} = route.params;

    const [codes, onChangeCodes] = useState<string>("");

    return (
        <SafeAreaView>
            <Header onBackButtonPress={navigation.goBack} backButtonVisible />
            <View style={{height: 52}} />
            <KeyboardAwareScrollView style={styles.wrapper}>
                <Text style={styles.title}>Verification</Text>
                <Text style={styles.subtitle}>Enter the code sent to your email</Text>
                <OtpInput
                    numberOfDigits={6}
                    onTextChange={onChangeCodes}
                    theme={{
                        pinCodeContainerStyle: {borderRadius: 10},
                        focusedPinCodeContainerStyle: {borderColor: "#128085"},
                        pinCodeTextStyle: {color: "#128085"},
                        focusStickStyle: {backgroundColor: "#128085"},
                    }}
                />
                <Button variant="green" text="Verify" onPress={() => onVerify(codes)} style={styles.button} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#FFF",
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#128085",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#494949",
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});
