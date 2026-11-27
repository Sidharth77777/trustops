import { ApiResponse, SuccessResponse } from "@trustops/shared";

export type EmptyData = Record<string, never>;

export const getSuccessData = <T>(response: ApiResponse<T>): SuccessResponse<T> => {
    if (!response.success) {
        throw new Error(response.message);
    }

    return response;
};