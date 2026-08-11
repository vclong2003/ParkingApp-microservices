import {trpc} from "@src/trpc";

export function useNotifications() {
    const response = trpc.user.notification.get.many.useQuery();
    const notifications = response.data || [];
    return Object.assign({notifications}, response);
}
