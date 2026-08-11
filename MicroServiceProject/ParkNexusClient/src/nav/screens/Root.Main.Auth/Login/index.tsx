import React from "react";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {styles} from "./index.styles";

import {TextInput} from "@src/components/Input__Text";
import {Text, View, TouchableOpacity} from "react-native";
import {Button} from "@src/components/Button";
import {Header} from "@src/components/Header";
import {Controller, useForm} from "react-hook-form";

import EmailSvg from "@src/static/svgs/Envelope.svg";
import PasswordSvg from "@src/static/svgs/Lock.svg";
import GoogleSvg from "@src/static/svgs/Google.svg";
import EyeSvg from "@src/static/svgs/Eye.svg";
import {useState} from "react";
import {TLoginPayload, useSubmit, useVerify} from "./index.submit";
import {NavigationProp} from "@react-navigation/native";
import {AuthStackParamList} from "@src/nav/navigators/Root.Main.Auth";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {AuthTypes} from "@src/auth/index.types";
import {useGoogleSignIn} from "@src/auth/auth.utils";

GoogleSignin.configure({
    iosClientId: AuthTypes.googleSignIn.iosClientId,
});

type ScreenParams = {
    navigation: NavigationProp<AuthStackParamList, "Login">;
};
export function Login({navigation}: ScreenParams) {
    const {bottom} = useSafeAreaInsets();
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const {signInWithGoogle} = useGoogleSignIn();

    const {verify, isPending: isVerifyPending} = useVerify();
    const onLoginSuccess = () => {
        if (isVerifyPending) return;
        navigation.navigate("Verification", {
            onVerify: code => verify({code}),
        });
    };

    const {control, handleSubmit} = useForm<TLoginPayload>({
        values: {
            email: "",
            password: "",
        },
    });
    const {submit, isPending} = useSubmit(onLoginSuccess);

    return (
        <SafeAreaView>
            <Header onBackButtonPress={navigation.goBack} backButtonVisible />
            <View style={{height: 52}} />
            <KeyboardAwareScrollView style={styles.wrapper}>
                <Text style={styles.title}>Log in your Account</Text>
                <View style={{height: 42}} />

                <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            onChangeText={onChange}
                            value={value}
                            preIcon={<EmailSvg width={24} height={24} />}
                            placeholder="Email"
                            defaultValue="vclong2003@gmail.com"
                            keyboardType="email-address"
                            textContentType="oneTimeCode"
                            autoCapitalize="none"
                        />
                    )}
                />
                <View style={{height: 8}} />
                <Controller
                    control={control}
                    name="password"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            blurOnSubmit={false}
                            secureTextEntry={!isPasswordVisible}
                            onChangeText={onChange}
                            value={value}
                            preIcon={<PasswordSvg width={24} height={24} />}
                            postIcon={
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    <EyeSvg width={20} height={20} />
                                </TouchableOpacity>
                            }
                            placeholder="Password"
                            defaultValue="12345678"
                        />
                    )}
                />
                <View style={{height: 12}} />
                <Button variant="green" text="Log in" disabled={isPending} onPress={handleSubmit(submit)} />

                <View style={{height: 24}} />
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>

                <View style={styles.dividerWrapper}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.oauthButtonWrapper}>
                    <Button variant="gray" preIcon={<GoogleSvg width={24} height={24} />} onPress={signInWithGoogle} />
                </View>
            </KeyboardAwareScrollView>
            <Text style={[styles.registerText, {bottom: bottom + 16}]} onPress={() => navigation.navigate("Register")}>
                Don’t have an account? <Text style={styles.registerTextColored}>Sign up</Text>
            </Text>
        </SafeAreaView>
    );
}
