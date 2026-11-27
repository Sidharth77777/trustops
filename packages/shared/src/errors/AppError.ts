import { ErrorCode } from "./errorCodes";

export class AppError extends Error {
    readonly statusCode: number;
    readonly code: ErrorCode;
    readonly isOperational: boolean;
    readonly details?: unknown;

    constructor (statusCode:number, message:string, code:ErrorCode, isOperational=true, details?: unknown) {
        super(message)
        this.name = "AppError"
        this.statusCode = statusCode
        this.code = code
        this.isOperational = isOperational
        this.details = details;
    }
}