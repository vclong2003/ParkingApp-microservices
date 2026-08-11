import {trpc, TrpcInput} from "@src/trpc";

export type TCancelPayload = TrpcInput["reservation"]["ticket"]["cancel"];
export function useCancel() {
    const mutation = trpc.reservation.ticket.cancel.useMutation();

    const ctx = trpc.useUtils();
    const cancel = (payload: TCancelPayload) => {
        mutation.mutate(payload, {
            onSuccess() {
                ctx.reservation.ticket.get.many.invalidate();
            },
        });
    };

    return Object.assign({cancel}, mutation);
}
