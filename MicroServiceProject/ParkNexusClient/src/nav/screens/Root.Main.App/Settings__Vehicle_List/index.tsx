import React from "react";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {useVehicles} from "./index.data";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";

import PlusTealSvg from "@src/static/svgs/PlusTeal.svg";
import {Pressable, ScrollView, Text, View} from "react-native";
import {styles} from "./index.styles";
import FastImage from "react-native-fast-image";
import {parseEnum} from "@src/utils/text";

export function Settings__Vehicle_List() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const {vehicles} = useVehicles();

    return (
        <SafeAreaView>
            <Header
                title="My Vehicles"
                backButtonVisible
                onBackButtonPress={() => navigation.goBack()}
                rightButtonIcon={<PlusTealSvg />}
                onRightButtonPress={() => navigation.navigate("Settings__Vehicle_Add")}
            />
            <ScrollView style={styles.wrapper}>
                {vehicles.map(vehicle => (
                    <Pressable
                        style={styles.vehicleWrapper}
                        key={vehicle.id}
                        onPress={() => navigation.navigate("Settings__Vehicle_Update", {vehicle})}>
                        <FastImage
                            source={{uri: vehicle.imageUrl}}
                            style={{width: 120, aspectRatio: 3 / 2, borderRadius: 10}}
                            resizeMode="cover"
                            fallback
                        />
                        <View style={styles.vehicleTextsWrapper}>
                            <Text style={styles.vehicleText}>
                                <Text style={styles.vehicleTextBold}>{parseEnum(vehicle.type)}: </Text>
                                {vehicle.brand} {vehicle.model}
                            </Text>
                            <Text style={styles.vehicleText}>
                                <Text style={styles.vehicleTextBold}>Color: </Text>
                                {vehicle.color}
                            </Text>
                            <Text style={styles.vehicleText}>
                                <Text style={styles.vehicleTextBold}>Plate: </Text>
                                {vehicle.plate}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
