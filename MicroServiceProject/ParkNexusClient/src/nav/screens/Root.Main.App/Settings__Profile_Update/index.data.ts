import {trpc} from "@src/trpc";

export function useMe() {
    const response = trpc.user.profile.get.single.useQuery(undefined, {queryKeyHashFn: () => "update_profile_screen"});
    const me = response.data;
    return Object.assign({me}, response);
}
