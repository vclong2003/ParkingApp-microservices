import {trpc, TrpcOutput} from "@src/trpc";

export function useServiceDetail(serviceId?: number) {
    const response = trpc.parking.lot.service.get.single.useQuery(
        {
            serviceId: serviceId!,
        },
        {
            enabled: !!serviceId,
        },
    );

    const service = response.data;

    return Object.assign({service}, response);
}

export type TServiceItem = TrpcOutput["parking"]["lot"]["service"]["get"]["single"];
