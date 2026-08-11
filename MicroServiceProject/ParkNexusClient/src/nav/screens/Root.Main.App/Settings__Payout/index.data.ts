import {trpc} from "@src/trpc";

export function useStripeConnectUrl() {
    const response = trpc.payment.payout.stripeConnectUrl.get.useQuery();
    const url = response.data?.url;
    return Object.assign({url}, response);
}

export function usePayoutHistory() {
    const response = trpc.payment.payout.get.many.useQuery({});
    const payouts = response.data || [];
    return Object.assign({payouts}, response);
}
