import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppStackParamList} from "@src/nav/navigators/Root.Main.App";
import {trpc} from "@src/trpc";

export function useStripePublishableKey() {
    const response = trpc.payment.key.stripePublishable.get.useQuery();
    const stripePublishableKey = response.data?.stripePublishableKey || "";
    return Object.assign({stripePublishableKey}, response);
}

export function useStripeIntent(ticketId: number) {
    const navigation = useNavigation<NavigationProp<AppStackParamList>>();
    const response = trpc.payment.reservation.stripeIntent.get.useQuery({
        ticketId,
    });
    if (response.isError) navigation.navigate("Reservation__Ticket_Detail", {ticketId});
    const stripeClientSecret = response.data?.clientSecret;
    const amountInUsd = response.data?.amountInUsd;
    return Object.assign({stripeClientSecret, amountInUsd}, response);
}

export function usePaymentMethods() {
    const response = trpc.payment.method.get.many.useQuery();
    const paymentMethods = response?.data || [];
    return Object.assign({paymentMethods}, response);
}
