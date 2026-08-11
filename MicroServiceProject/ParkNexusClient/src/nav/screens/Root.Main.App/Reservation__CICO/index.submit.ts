import {trpc} from "@src/trpc";
import {parseTrpcErrorMessage} from "@src/utils/trpcHelpers";
import Toast from "react-native-toast-message";

export function useCheckIn() {
    const mutation = trpc.reservation.ticket.checkIn.useMutation();

    const ctx = trpc.useUtils();
    const checkIn = (ticketCode: string) => {
        mutation.mutate(
            {ticketCode},
            {
                onSuccess() {
                    ctx.reservation.ticket.get.many.invalidate();
                    ctx.reservation.ticket.get.single.invalidate();
                    Toast.show({
                        type: "success",
                        text1: "Check In Success",
                    });
                },
                onError(error) {
                    Toast.show({
                        type: "error",
                        text1: parseTrpcErrorMessage(error.message),
                    });
                },
            },
        );
    };

    return Object.assign({checkIn}, mutation);
}

export function useCheckOut() {
    const mutation = trpc.reservation.ticket.checkOut.useMutation();

    const ctx = trpc.useUtils();
    const checkOut = (ticketCode: string) => {
        mutation.mutate(
            {ticketCode},
            {
                onSuccess() {
                    ctx.reservation.ticket.get.many.invalidate();
                    ctx.reservation.ticket.get.single.invalidate();
                    Toast.show({
                        type: "success",
                        text1: "Check Out Success",
                    });
                },
                onError(error) {
                    Toast.show({
                        type: "error",
                        text1: parseTrpcErrorMessage(error.message),
                    });
                },
            },
        );
    };

    return Object.assign({checkOut}, mutation);
}
