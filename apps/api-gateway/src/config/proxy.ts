import { getRequestContext, HEADERS } from "@trustops/shared";
import { ClientRequest } from "node:http";

export const setProxyReq = (proxyReq:ClientRequest): void => {
    const context = getRequestContext()
    if (!context) return

    proxyReq.setHeader(HEADERS.x_request_id, context.requestId)
    proxyReq.setHeader(HEADERS.x_correlation_id, context.correlationId)
}