import {trpc, TrpcInput} from "@src/trpc";

export type TFilter = TrpcInput["reservation"]["ticket"]["get"]["many"]["filter"];
export function useMyTickets(filter?: TFilter) {
    const response = trpc.reservation.ticket.get.many.useQuery({
        isMine: true,
        filter,
    });

    const tickets = response?.data || [];

    return Object.assign({tickets}, response);
}
