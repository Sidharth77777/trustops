import {createProxyMiddleware} from "http-proxy-middleware"
import { Router } from "express"
import { SERVICES } from "../config/env"
import { setProxyReq } from "../config/proxy"
import { endpointGuard } from "../middleware/endpointGuard"

export const proxyRouter = Router()

proxyRouter.use(endpointGuard)

proxyRouter.use("/auth", createProxyMiddleware({
    target: SERVICES.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/auth${path}`,
    on: {
        proxyReq: (proxyReq) => setProxyReq(proxyReq)
    },
}))
