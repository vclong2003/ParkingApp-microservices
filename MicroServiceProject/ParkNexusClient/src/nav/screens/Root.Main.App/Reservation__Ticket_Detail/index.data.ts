import {trpc} from "@src/trpc";

export const useTicketDetail = (ticketId: number) => {
    const response = trpc.reservation.ticket.get.single.useQuery({
        id: ticketId,
    });

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
};
