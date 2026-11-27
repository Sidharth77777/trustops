import { ZodSchema } from "zod";
import { Response, Request, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/errorCodes";

export const validateBody = (schema:ZodSchema) => {
    return (req:Request, _res:Response, next:NextFunction) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            const errors = result.error.issues.reduce<Record<string, string>>(
                (acc, issue) => {
                    const field = issue.path.join(".")
                    if (!acc[field]) {
                        acc[field] = issue.message
                    }
                    return acc
                }, {}
            )
           

            return next(new AppError(400, "Validation failed", ErrorCodes.BAD_REQUEST, true, errors))
        }

        req.body = result.data

        next()

    }

}