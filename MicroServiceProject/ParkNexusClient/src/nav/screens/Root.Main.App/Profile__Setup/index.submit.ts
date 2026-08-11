import {trpc, TrpcInput} from "@src/trpc";

export type TCreateProfilePayload = TrpcInput["user"]["profile"]["create"];

export function useSubmit() {
    const mutation = trpc.user.profile.create.useMutation();
    const ctx = trpc.useUtils();

    const submit = (payload: TCreateProfilePayload) => {
        mutation.mutate(payload, {
            onSuccess() {
                ctx.user.profile.get.single.invalidate();
            },
        });
    };

    return Object.assign(mutation, {submit});
}
