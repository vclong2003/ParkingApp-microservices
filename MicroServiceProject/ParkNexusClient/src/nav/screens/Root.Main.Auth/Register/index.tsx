import React from "react";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {AuthStackParamList} from "@src/nav/navigators/Root.Main.Auth";
import {Controller, useForm} from "react-hook-form";
import {Text, View} from "react-native";
import {TRegisterPayload, useSubmit, useVerify} from "./index.submit";
import {Button} from "@src/components/Button";
import {styles} from "./index.styles";

import EmailSvg from "@src/static/svgs/Envelope.svg";
import PasswordSvg from "@src/static/svgs/Lock.svg";
import EyeSvg from "@src/static/svgs/Eye.svg";

import {TextInput} from "@src/components/Input__Text";
import {TouchableOpacity} from "react-native-gesture-handler";
import {useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

export function Register() {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const {verify, isPending: isVerifyPending} = useVerify();
    const onRegisterSuccess = () => {
        if (isVerifyPending) return;
        navigation.navigate("Verification", {
            onVerify: code => verify({code}),
        });
    };

    const {control, handleSubmit} = useForm<TRegisterPayload>({
        values: {
            email: "",
            password: "",
            passwordRetype: "",
        },
    });
    const {submit, isPending} = useSubmit(onRegisterSuccess);

    const {bottom} = useSafeAreaInsets();
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
        <SafeAreaView>
            <Header onBackButtonPress={navigation.goBack} backButtonVisible />
            <View style={{height: 52}} />
            <KeyboardAwareScrollView style={styles.wrapper}>
                <Text style={styles.title}>Create your Account</Text>
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
                        />
                    )}
                />
                <View style={{height: 8}} />
                <Controller
                    control={control}
                    name="passwordRetype"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            blurOnSubmit={false}
                            secureTextEntry={!isPasswordVisible}
                            onChangeText={onChange}
                            value={value}
                            preIcon={<PasswordSvg width={24} height={24} />}
                            placeholder="Retype Password"
                        />
                    )}
                />
                <View style={{height: 12}} />
                <Button variant="green" text="Continue" disabled={isPending} onPress={handleSubmit(submit)} />
            </KeyboardAwareScrollView>
            <Text style={[styles.loginText, {bottom: bottom + 16}]} onPress={() => navigation.navigate("Login")}>
                Already have an account? <Text style={styles.loginTextColored}>Log in</Text>
            </Text>
        </SafeAreaView>
    );
}
