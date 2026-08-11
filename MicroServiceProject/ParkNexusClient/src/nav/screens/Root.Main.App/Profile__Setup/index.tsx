import React from "react";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {TCreateProfilePayload, useSubmit} from "./index.submit";
import {Controller, useForm} from "react-hook-form";
import {ScrollView, Text, View} from "react-native";
import {styles} from "./index.styles";
import {TextInput} from "@src/components/Input__Text";
import {Button} from "@src/components/Button";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {launchImageLibrary, Asset} from "react-native-image-picker";
import {useUpload} from "@src/utils/upload";
import FastImage from "react-native-fast-image";

import AvatarPlaceHolder from "@src/static/images/Profile.png";
import NotePencil from "@src/static/svgs/NotePencil.svg";
import {useState} from "react";
import {z} from "zod";
import {USER__GENDER_ALIAS} from "@parknexus/api/prisma/client";
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
    gender: z.nativeEnum(USER__GENDER_ALIAS),
    avatarUrl: z.string().optional(),
});

export function Profile__Setup() {
    const {bottom} = useSafeAreaInsets();
    const [selectedAvatar, setSelectedAvatar] = useState<Asset>();
    const {submit, isPending} = useSubmit();
    const {isUploading, uploadAvatar} = useUpload();
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<TCreateProfilePayload>({
        values: {
            firstName: "",
            lastName: "",
            phone: "",
            gender: "MALE",
            avatarUrl: "",
        },
        resolver: zodResolver(schema),
    });

    const openImagePicker = () => {
        launchImageLibrary({mediaType: "photo", selectionLimit: 1}).then(async ({assets}) => {
            const asset = assets?.[0];
            if (!asset?.uri) return;
            setSelectedAvatar(asset);
        });
    };

    const onSubmit = async (values: TCreateProfilePayload) => {
        let avatarUrl = "";
        if (selectedAvatar && selectedAvatar.uri && selectedAvatar.type && selectedAvatar.fileName) {
            avatarUrl = await uploadAvatar({
                file: {uri: selectedAvatar.uri, name: selectedAvatar.fileName, type: selectedAvatar.type},
            });
        }
        submit({...values, avatarUrl});
    };

    return (
        <SafeAreaView>
            <Header title="Fill Your Profile" />

            <ScrollView style={styles.wrapper}>
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
                                source={selectedAvatar ? {uri: selectedAvatar.uri} : AvatarPlaceHolder}
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

                {/* First name ----------------------------- */}
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

                {/* Last name ----------------------------- */}
                <View style={{height: 10}} />
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

                {/* Phone --------------------------------- */}
                <View style={{height: 10}} />
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
            </ScrollView>

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
