import {trpc} from "@src/trpc";

export function useCustomerTicketDetail(ticketCode: string) {
    const response = trpc.reservation.ticket.get.single.useQuery(
        {
            code: ticketCode,
        },
        {enabled: !!ticketCode},
    );

    const ticket = response.data;

    trpc.reservation.ticket.get.shouldUpdate.single.useSubscription(
        {
            id: ticket?.id,
        },
        {
            onData() {
                response.refetch();
            },
        },
    );

    return Object.assign({ticket}, response);
}
