import {trpc, TrpcInput} from "@src/trpc";

export type TCreateTicketPayload = TrpcInput["reservation"]["ticket"]["create"];
export function useCreateTicker() {
    const mutation = trpc.reservation.ticket.create.useMutation();

    const ctx = trpc.useUtils();
    const createTicket = async (payload: TCreateTicketPayload) => {
        return mutation.mutateAsync(payload, {
            onSuccess() {
                ctx.reservation.ticket.get.many.invalidate();
            },
        });
    };

    return Object.assign({createTicket}, mutation);
}
