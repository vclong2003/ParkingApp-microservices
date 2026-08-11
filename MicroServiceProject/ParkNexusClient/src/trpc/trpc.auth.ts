import axios from "axios";
import {TRPCLink} from "@trpc/react-query";
import {TrpcRouter} from "@parknexus/api";
import {observable} from "@trpc/server/observable";
import {AuthStorage} from "@src/auth/auth.utils";
import {ApiTypes} from "@src/types/types.api";

export const headers = async () => {
    const accessToken = await AuthStorage.getAccessToken();
    if (!accessToken) return {};
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};

export const getAccessToken = async (): Promise<string | null> => {
    const refreshToken = await AuthStorage.getRefreshToken();
    if (!refreshToken) return null;
    const response = await axios.post(`${ApiTypes.API_HOST}/auth.getAccessToken`, {
        refreshToken,
    });
    const accessToken = response?.data?.result?.data?.accessToken || null;

    return accessToken;
};

export const authLinkInterceptor: TRPCLink<TrpcRouter> = () => {
    return ({next, op}) => {
        return observable(observer => {
            const unsubscribe = next(op).subscribe({
                next(value) {
                    observer.next(value);
                },
                async error(err) {
                    if (err?.data?.code === "UNAUTHORIZED") {
                        // Get new access token ------------------------
                        let newAccessToken;
                        try {
                            newAccessToken = await getAccessToken();
                        } catch (_) {
                            observer.error(err);
                        }
                        if (!newAccessToken) return observer.error(err);

                        // Store new access token ------------------------
                        await AuthStorage.setAccessToken(newAccessToken);

                        next(op).subscribe({
                            next: observer.next,
                            error: observer.error,
                            complete: observer.complete,
                        });
                    } else {
                        observer.error(err);
                    }
                },
                complete() {
                    observer.complete();
                },
            });
            return unsubscribe;
        });
    };
};
