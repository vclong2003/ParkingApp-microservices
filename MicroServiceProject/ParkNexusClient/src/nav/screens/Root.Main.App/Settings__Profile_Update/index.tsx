import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Asset, launchImageLibrary} from "react-native-image-picker";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {TUpdateProfilePayload, useSubmit} from "./index.submit";
import {Controller, useForm} from "react-hook-form";
import {useMe} from "./index.data";
import FastImage from "react-native-fast-image";
import {Button} from "@src/components/Button";

import NotePencil from "@src/static/svgs/NotePencil.svg";
import {TextInput} from "@src/components/Input__Text";
import AvatarPlaceHolder from "@src/static/images/Profile.png";
import {useUpload} from "@src/utils/upload";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const schema = z.object({
    firstName: z.string().min(1, {message: "First name is required"}),
    lastName: z.string().min(1, {message: "Last name is required"}),
    phone: z
        .string()
        .min(1, {message: "Phone is required"})
        .regex(/^\d{10,11}$/, {
            message: "Phone is invalid  (10-11 digits)",
        }),
    avatarUrl: z.string().optional(),
});

export function Settings__Profile_Update() {
    const navigation = useNavigation();
    const {bottom} = useSafeAreaInsets();
    const [avatar, setAvatar] = useState<Asset>();
    const {
        control,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<TUpdateProfilePayload>({
        resolver: zodResolver(schema),
    });
    const {me} = useMe();
    const {submit, isPending} = useSubmit();
    const {isUploading, uploadAvatar} = useUpload();

    const openImagePicker = () => {
        launchImageLibrary({mediaType: "photo", selectionLimit: 1}).then(async ({assets}) => {
            const asset = assets?.[0];
            if (!asset?.uri) return;
            setAvatar(asset);
        });
    };

    const onSubmit = async (values: TUpdateProfilePayload) => {
        let avatarUrl: string | undefined;
        if (avatar && avatar.uri && avatar.type && avatar.fileName) {
            avatarUrl = await uploadAvatar({
                file: {uri: avatar.uri, name: avatar.fileName, type: avatar.type},
            });
        }
        submit({...values, avatarUrl});
    };

    useEffect(() => {
        if (!me) return;

        setValue("firstName", me.firstName);
        setValue("lastName", me.lastName);
        setValue("avatarUrl", me.avatarUrl || undefined);
        setValue("phone", me.phone);
    }, [me]);

    return (
        <SafeAreaView>
            <Header title="Update Profile" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
            <KeyboardAwareScrollView style={styles.wrapper}>
                <Controller
                    control={control}
                    name="avatarUrl"
                    render={() => (
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: 32,
                                marginBottom: 32,
                            }}>
                            <FastImage
                                source={
                                    avatar
                                        ? {uri: avatar.uri}
                                        : me?.avatarUrl
                                        ? {uri: me?.avatarUrl}
                                        : AvatarPlaceHolder
                                }
                                resizeMode="cover"
                                style={{width: "100%", height: "100%", borderRadius: 50}}
                            />
                            <Button
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    width: 28,
                                    height: 28,
                                    borderRadius: 14,
                                }}
                                variant="green"
                                preIcon={<NotePencil width={16} height={16} />}
                                onPress={openImagePicker}
                            />
                        </View>
                    )}
                />

                {/* First name --------------------------------------------------------- */}
                <Text style={styles.fieldLabel}>First Name</Text>
                <Controller
                    control={control}
                    name="firstName"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            error={errors.firstName?.message}
                            onChangeText={onChange}
                            value={value}
                            placeholder="John"
                        />
                    )}
                />
                <View style={{height: 10}} />

                {/* Last name --------------------------------------------------------- */}
                <Text style={styles.fieldLabel}>Last Name</Text>
                <Controller
                    control={control}
                    name="lastName"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            error={errors.lastName?.message}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Doe"
                        />
                    )}
                />
                <View style={{height: 10}} />

                {/* Phone -------------------------------------------------------------- */}
                <Text style={styles.fieldLabel}>Phone</Text>
                <Controller
                    control={control}
                    name="phone"
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            error={errors.phone?.message}
                            onChangeText={onChange}
                            value={value}
                            placeholder="5556667777"
                            keyboardType="phone-pad"
                        />
                    )}
                />
            </KeyboardAwareScrollView>

            <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isPending || isUploading}
                variant="green"
                text={isUploading || isPending ? "Saving..." : "Submit"}
                style={[styles.submitButton, {bottom: bottom + 16}]}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
        color: "#555555",
    },
    submitButton: {
        position: "absolute",
        left: 16,
        right: 16,
    },
});
