import {trpc} from '@src/trpc';

export function usePaymentMethods() {
    const response = trpc.payment.method.get.many.useQuery();
    const paymentMethods = response?.data || [];
    return Object.assign({paymentMethods}, response);
}
