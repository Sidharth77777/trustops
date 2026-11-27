import { ErrorCode } from "../errors/errorCodes";

export type SuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

export type ErrorResponse = {
    success: false;
    message: string;
    code: ErrorCode;
    details?: unknown;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;