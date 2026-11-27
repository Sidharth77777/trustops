import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import { ErrorCodes } from "./errorCodes";

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        console.error("ACTUAL ERROR:", err);

        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            ...(err.details !== undefined && {
                details: err.details,
            }),
        });
    }

    console.error("ACTUAL ERROR:", err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
};