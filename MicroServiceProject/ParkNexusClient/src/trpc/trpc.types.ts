import {TrpcRouter} from "@parknexus/api";
import {inferRouterInputs, inferRouterOutputs} from "@trpc/server";

export type TrpcInput = inferRouterInputs<TrpcRouter>;
export type TrpcOutput = inferRouterOutputs<TrpcRouter>;
