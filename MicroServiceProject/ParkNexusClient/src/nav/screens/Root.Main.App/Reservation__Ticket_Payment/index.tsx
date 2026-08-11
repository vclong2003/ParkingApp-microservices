import React from "react";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {Header} from "@src/components/Header";
import {SafeAreaView} from "@src/components/SafeAreaWrapper";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {useStripePublishableKey} from "./index.data";
import {StripeProvider} from "@stripe/stripe-react-native";
import {Payment} from "./index.payment";

type ScreenProps = {
    navigation: NavigationProp<AppStackParamList, "Reservation__Ticket_Payment">;
    route: RouteProp<AppStackParamList, "Reservation__Ticket_Payment">;
};
export function Reservation__Ticket_Payment({navigation, route}: ScreenProps) {
    const {stripePublishableKey} = useStripePublishableKey();

    return (
        <StripeProvider publishableKey={stripePublishableKey}>
            <SafeAreaView>
                <Header
                    title="Ticket Payment"
                    backButtonVisible
                    onBackButtonPress={() =>
                        navigation.navigate("Reservation__Ticket_Detail", {ticketId: route.params.ticketId})
                    }
                />
                <Payment ticketId={route.params.ticketId} />
            </SafeAreaView>
        </StripeProvider>
    );
}
