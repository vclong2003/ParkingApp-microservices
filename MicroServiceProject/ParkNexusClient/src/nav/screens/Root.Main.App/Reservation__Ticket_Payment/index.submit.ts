import {trpc, TrpcInput} from "@src/trpc";

type TVerifyPaymentPayload = TrpcInput["payment"]["reservation"]["verifyPayment"];
export function useVerifyPayment() {
    const mutation = trpc.payment.reservation.verifyPayment.useMutation();

    const ctx = trpc.useUtils();
    const verifyPayment = (payload: TVerifyPaymentPayload, onSuccess?: () => void) => {
        mutation.mutate(payload, {
            onSuccess() {
                ctx.reservation.ticket.get.many.invalidate();
                ctx.reservation.ticket.get.single.invalidate();
                onSuccess?.();
            },
        });
    };

    return Object.assign({verifyPayment}, mutation);
}
