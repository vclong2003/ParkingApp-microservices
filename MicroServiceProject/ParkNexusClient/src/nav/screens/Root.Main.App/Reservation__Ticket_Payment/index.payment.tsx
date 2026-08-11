import React from "react";
import _ from "lodash";
import {useConfirmPayment} from "@stripe/stripe-react-native";
import {usePaymentMethods, useStripeIntent} from "./index.data";
import {useState} from "react";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {Button} from "@src/components/Button";
import {useVerifyPayment} from "./index.submit";
import {InputRadioButton} from "@src/components/Input__RadioButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";

type ScreenProps = {
    ticketId: number;
};
export function Payment({ticketId}: ScreenProps) {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const {confirmPayment, loading} = useConfirmPayment();
    const {stripeClientSecret} = useStripeIntent(ticketId);
    const {paymentMethods} = usePaymentMethods();
    const {verifyPayment, isPending} = useVerifyPayment();

    const [paymentMethodId, setPaymentMethodId] = useState<string>();

    const onConfirmPayment = async () => {
        if (!stripeClientSecret || !paymentMethodId) return;
        const {error, paymentIntent} = await confirmPayment(stripeClientSecret, {
            paymentMethodType: "Card",
            paymentMethodData: {
                paymentMethodId: paymentMethodId,
            },
        });
        if (paymentIntent)
            verifyPayment({ticketId, intentId: paymentIntent.id}, () => {
                navigation.navigate("Reservation__Ticket_Detail", {ticketId});
            });
        if (error) console.log("error", error);
    };

    return (
        <>
            <ScrollView style={styles.container}>
                {paymentMethods.map(method => (
                    <Pressable
                        key={method.id}
                        onPress={() => setPaymentMethodId(method.id)}
                        style={[styles.cardContainer, method.id === paymentMethodId && styles.cardSelected]}>
                        <View>
                            <Text style={styles.cardBrand}>
                                {_.upperCase(method.card?.brand)} - {_.startCase(method.card?.funding)} Card
                            </Text>
                            <Text style={styles.cardLast4}>**** {method.card?.last4}</Text>
                        </View>
                        <InputRadioButton isSelected={method.id === paymentMethodId} />
                    </Pressable>
                ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button variant="gray" text="Cancel" onPress={() => {}} style={styles.button} />
                <Button
                    variant="pink"
                    text="Pay"
                    onPress={onConfirmPayment}
                    style={styles.button}
                    disabled={!paymentMethodId || loading || isPending}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#d9d9d9",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    cardSelected: {
        borderColor: "#128085",
        backgroundColor: "#e0f7fa",
    },
    cardBrand: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    cardLast4: {
        fontSize: 14,
        color: "#555",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        margin: 16,
    },
    button: {
        flex: 1,
    },
});
