import { AsyncLocalStorage } from "node:async_hooks";
import { RequestContext } from "./types";
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/errorCodes";

const requestContextStorage = new AsyncLocalStorage<RequestContext>()

export const runWithRequestContext = <T>(context:RequestContext, callback: () => T): T => {
    return requestContextStorage.run(context, callback)
}

// returns 'requestId' and 'correlationId'
export const getRequestContext = (): RequestContext | undefined => {
    return requestContextStorage.getStore()
}

export const checkContext = (): RequestContext => {
    const context = getRequestContext()
    if (!context) throw new AppError(500, "Request context unavailable", ErrorCodes.INTERNAL_SERVER_ERROR)
    return context
}