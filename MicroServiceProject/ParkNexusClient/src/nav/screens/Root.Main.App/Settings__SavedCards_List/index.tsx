import React from "react";
import _ from "lodash";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {usePaymentMethods} from "./index.data";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";

import PlusTealSvg from "@src/static/svgs/PlusTeal.svg";
import {ScrollView} from "react-native-gesture-handler";
import {RefreshControl, Text, View} from "react-native";
import {useDestroy} from "./index.destroy";
import {useActionSheet} from "@expo/react-native-action-sheet";

import TrashSvg from "@src/static/svgs/Trash.svg";
import {Button} from "@src/components/Button";
import {styles} from "./index.styles";

export function Settings__SavedCards_List() {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const {showActionSheetWithOptions} = useActionSheet();
    const {paymentMethods, isRefetching, refetch} = usePaymentMethods();
    const {destroy} = useDestroy();

    const onDestroy = (id: string) => {
        showActionSheetWithOptions(
            {
                options: ["Cancel", "Delete"],
                cancelButtonIndex: 0,
                message: "Are you sure you want to delete this card?",
            },
            index => {
                if (index === 1) {
                    destroy(id);
                }
            },
        );
    };

    return (
        <SafeAreaView>
            <Header
                title="Saved Cards"
                backButtonVisible
                onBackButtonPress={() => navigation.goBack()}
                rightButtonIcon={<PlusTealSvg />}
                onRightButtonPress={() => navigation.navigate("Settings__SavedCards_Add")}
            />
            <ScrollView style={styles.wrapper}>
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                {paymentMethods.map(method => (
                    <View key={method.id} style={styles.cardContainer}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardText}>
                                {_.upperCase(method.card?.brand)} {_.startCase(method.card?.funding)} card
                            </Text>
                            <Text style={styles.cardText}>**** {method.card?.last4} </Text>
                            <Text style={styles.cardText}>
                                Expired: {method.card?.exp_month}/{method.card?.exp_year}
                            </Text>
                        </View>
                        <Button
                            variant="pink"
                            preIcon={<TrashSvg />}
                            onPress={() => onDestroy(method.id)}
                            style={styles.trashButton}
                        />
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
