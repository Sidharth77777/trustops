import { Request, Response, NextFunction } from "express"
import {randomUUID} from "node:crypto"
import { HEADERS } from "../config/constants"
import { runWithRequestContext } from "./requestContext"

export const requestIdMiddleware = (req:Request, res:Response, next:NextFunction): void => {
    const requestId =  randomUUID()
    const correlationId = req.header(HEADERS.x_correlation_id) ?? randomUUID()

    res.setHeader(HEADERS.x_request_id, requestId)
    res.setHeader(HEADERS.x_correlation_id, correlationId)

    runWithRequestContext(
        {requestId, correlationId},
        () => next()
    )

}