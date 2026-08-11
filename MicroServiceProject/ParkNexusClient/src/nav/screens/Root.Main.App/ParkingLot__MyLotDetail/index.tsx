import React from "react";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {ScrollView, Text, View} from "react-native";
import {useMyParkingLot} from "./index.data";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {Header} from "@src/components/Header";
import FastImage from "react-native-fast-image";
import {styles} from "./index.styles";
import {Button} from "@src/components/Button";
import dayjs from "dayjs";

import DotsHorizontalTeal from "@src/static/svgs/DotsHorizontalTeal.svg";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {useUpdateParkingLot} from "./index.submit";

type ScreenProps = {
    navigation: NavigationProp<AppStackParamList>;
    route: RouteProp<AppStackParamList, "ParkingLot__MyLotDetail">;
};
export function ParkingLot__MyLotDetail({navigation, route}: ScreenProps) {
    const {lotId} = route.params;
    const {data: lot} = useMyParkingLot(lotId);
    const {updateParkingLot, isPending} = useUpdateParkingLot();
    const {showActionSheetWithOptions} = useActionSheet();

    const onSetOnVacation = () => {
        const options = ["Stop receiving vehicles", "Cancel"];
        const destructiveButtonIndex = 0;
        const cancelButtonIndex = 1;

        showActionSheetWithOptions(
            {
                message: "Are you sure you want to stop receiving vehicles?",
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            buttonIndex => {
                if (buttonIndex === 0) updateParkingLot({id: lotId, status: "INACTIVE"});
            },
        );
    };

    const onSetOffVacation = () => {
        const options = ["Start receiving vehicles", "Cancel"];
        const destructiveButtonIndex = 0;
        const cancelButtonIndex = 1;

        showActionSheetWithOptions(
            {
                message: "Are you sure you want to start receiving vehicles?",
                options,
                destructiveButtonIndex,
                cancelButtonIndex,
            },
            buttonIndex => {
                if (buttonIndex === 0) updateParkingLot({id: lotId, status: "ACTIVE"});
            },
        );
    };

    return (
        <SafeAreaView>
            <Header title="My Parking Lot" backButtonVisible onBackButtonPress={() => navigation.goBack()} />
            <ScrollView style={styles.wrapper}>
                <View style={styles.sectionWrapper}>
                    {/* Info ---------------------------------------------------------------- */}
                    <View style={styles.sectionTitleWrapper}>
                        <Text style={styles.sectionTitle}>Parking Lot Info</Text>
                        <Button
                            style={styles.editBtn}
                            variant="gray"
                            preIcon={<DotsHorizontalTeal width={24} height={24} />}
                            onPress={() => navigation.navigate("ParkingLot__Update", {lotId})}
                        />
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {lot?.mediaUrls.map(url => (
                            <FastImage key={url} source={{uri: url}} style={styles.image} resizeMode="cover" fallback />
                        ))}
                    </ScrollView>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.text}>{lot?.name}</Text>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.text}>{lot?.phone}</Text>
                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.text}>{lot?.description}</Text>
                    <Text style={styles.label}>Approved:</Text>
                    <Text style={styles.text}>{lot?.isApproved ? "Approved" : "Not Approved"}</Text>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={styles.text}>{lot?.status}</Text>
                    <Text style={styles.label}>Open At:</Text>
                    <Text style={styles.text}>
                        {lot?.openAt} - {lot?.closeAt}
                    </Text>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.text}>
                        Lat: {lot?.latitude} - Lon: {lot?.longitude}
                    </Text>
                    <Text style={styles.label}>Created At:</Text>
                    <Text style={styles.text}>{dayjs(lot?.createdAt).format("HH:MM  MMMM DD YYYY")}</Text>
                    <Text style={styles.label}>Updated At:</Text>
                    <Text style={styles.text}>{dayjs(lot?.updatedAt).format("HH:MM  MMMM DD YYYY")}</Text>
                </View>

                {/* Spots ---------------------------------------------------------------- */}
                <View style={styles.sectionWrapper}>
                    <View style={styles.sectionTitleWrapper}>
                        <Text style={styles.sectionTitle}>Spots</Text>
                        <Button
                            style={styles.editBtn}
                            variant="gray"
                            preIcon={<DotsHorizontalTeal width={24} height={24} />}
                            onPress={() => navigation.navigate("ParkingLot__Spots__Manage", {lotId})}
                        />
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {lot?.parkingSpots.map((item, index) => (
                            <View key={index} style={styles.itemContainer}>
                                <Text style={styles.label}>Name:</Text>
                                <Text style={styles.text}>{item.name}</Text>
                                <Text style={styles.label}>Vehicle Type:</Text>
                                <Text style={styles.text}>{item.vehicleType}</Text>
                                <Text style={styles.label}>Available:</Text>
                                <Text style={styles.text}>{item.isAvailable ? "Available" : "Occupied"}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Prices ---------------------------------------------------------------- */}
                <View style={styles.sectionWrapper}>
                    <View style={styles.sectionTitleWrapper}>
                        <Text style={styles.sectionTitle}>Prices</Text>
                        <Button
                            style={styles.editBtn}
                            variant="gray"
                            preIcon={<DotsHorizontalTeal width={24} height={24} />}
                            onPress={() => navigation.navigate("ParkingLot__Prices__Manage", {lotId})}
                        />
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {lot?.parkingLotPrices.map((item, index) => (
                            <View key={index} style={styles.itemContainer}>
                                <Text style={styles.label}>Price:</Text>
                                <Text style={styles.text}>${item.price}</Text>
                                <Text style={styles.label}>Vehicle Type:</Text>
                                <Text style={styles.text}>{item.vehicleType}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Services ---------------------------------------------------------------- */}
                <View style={styles.sectionWrapper}>
                    <View style={styles.sectionTitleWrapper}>
                        <Text style={styles.sectionTitle}>Services</Text>
                        <Button
                            style={styles.editBtn}
                            variant="gray"
                            preIcon={<DotsHorizontalTeal width={24} height={24} />}
                            onPress={() => navigation.navigate("ParkingLot__Services__Manage", {lotId})}
                        />
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {lot?.parkingLotServices.map((item, index) => (
                            <View key={index} style={styles.itemContainer}>
                                <Text style={styles.label}>Name:</Text>
                                <Text style={styles.text}>{item.name}</Text>
                                <Text style={styles.label}>Price:</Text>
                                <Text style={styles.text}>${item.price}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Set on vacation ---------------------------------------------------------------- */}
                <View style={{height: 16}} />
                {lot?.status === "ACTIVE" ? (
                    <Button disabled={isPending} variant="pink" text="Set on vacation" onPress={onSetOnVacation} />
                ) : null}
                {lot?.isApproved && lot?.status === "INACTIVE" ? (
                    <Button
                        disabled={isPending}
                        variant="green"
                        text="Disable on vacation"
                        onPress={onSetOffVacation}
                    />
                ) : null}

                <View style={{height: 16}} />
            </ScrollView>
        </SafeAreaView>
    );
}
