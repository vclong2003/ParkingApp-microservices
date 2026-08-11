import {TrpcRouter} from "@parknexus/api";

import {createTRPCReact} from "@trpc/react-query";

export const trpc = createTRPCReact<TrpcRouter>();
