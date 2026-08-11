import {trpc} from '@src/trpc';

export function useDestroy() {
    const mutation = trpc.payment.method.remove.useMutation();

    const ctx = trpc.useUtils();
    const destroy = (id: string) => {
        mutation.mutate(
            {paymentMethodId: id},
            {
                onSuccess() {
                    ctx.payment.method.get.many.invalidate();
                },
            },
        );
    };

    return Object.assign({destroy}, mutation);
}
