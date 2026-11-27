import { Request, Response } from "express"
import { ErrorCodes } from "../errors/errorCodes"
import { sendFailResponse } from "../responses/response";

export const notFound = (_req:Request, res:Response) => {
    return sendFailResponse(
        res,
        "User not found",
        404,
        ErrorCodes.NOT_FOUND
    )
}