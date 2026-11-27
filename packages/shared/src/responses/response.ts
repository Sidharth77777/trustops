import {Response} from "express"
import {SuccessResponse, ErrorResponse} from "./types"
import { ErrorCodes, ErrorCode } from "./../errors/errorCodes";


export const sendSuccessResponse = <T>(res:Response, message:string, data:T, statusCode=200) => {
    const response: SuccessResponse<T> = {
        success: true,
        message,
        data,
    }

    return res.status(statusCode).json(response)
}

export const sendFailResponse = (res:Response, message:string, statusCode=400, code:ErrorCode=ErrorCodes.BAD_REQUEST) => {
    const response: ErrorResponse = {
        success: false,
        message,
        code,
    }

    return res.status(statusCode).json(response)
}
