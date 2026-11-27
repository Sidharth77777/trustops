import {Request, Response, NextFunction} from "express"
import { endpointsMap } from "../endpoints"
import { sendFailResponse } from "@trustops/shared"

export const endpointGuard = (req:Request, res:Response, next:NextFunction): void => {
    const endpoint = endpointsMap.get(
        `${req.method}:${req.path}`
    )

    if (!endpoint) {
        sendFailResponse(res, "Route not found", 404)
        return
    }

    next()
}