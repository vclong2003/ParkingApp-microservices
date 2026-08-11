import {trpc} from '@src/trpc';

export function useStripePublishableKey() {
    const response = trpc.payment.key.stripePublishable.get.useQuery();
    const stripePublishableKey = response.data?.stripePublishableKey || '';
    return Object.assign({stripePublishableKey}, response);
}
