import {trpc} from "@src/trpc";

export function useTicketDetail(spotId?: number) {
    const response = trpc.reservation.ticket.get.single.useQuery(
        {spotId},
        {
            enabled: !!spotId,
        },
    );

    const ticket = response.data;

    return Object.assign({ticket}, response);
}
