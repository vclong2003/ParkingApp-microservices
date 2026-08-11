import React, {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {trpc} from "./trpc";
import {httpBatchLink, splitLink, unstable_httpSubscriptionLink} from "@trpc/react-query";
import {authLinkInterceptor, headers} from "./trpc.auth";
import {ApiTypes} from "@src/types/types.api";

type TrpcProviderProps = {
    children: React.ReactNode;
};
export const TrpcProvider = ({children}: TrpcProviderProps) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {queries: {retry: false}},
            }),
    );
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                authLinkInterceptor,
                splitLink({
                    condition: op => op.type === "subscription",
                    true: unstable_httpSubscriptionLink({
                        url: ApiTypes.API_HOST,
                    }),
                    false: httpBatchLink({
                        url: ApiTypes.API_HOST,
                        headers,
                    }),
                }),
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    );
};
