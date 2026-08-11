import {trpc} from "@src/trpc";

export function useData() {
    const response = trpc.auth.getAuthState.useQuery();

    return response;
}
