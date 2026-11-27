import { errorHandler, notFound, requestIdMiddleware, sendSuccessResponse } from "@trustops/shared"
import express from "express"
import { proxyRouter } from "./routes/proxy.routes"
import helmet from "helmet"
import { corsConfig } from "./config/cors"
import { rateLimiter } from "./config/rateLimit"

export const app = express()

app.use(helmet())

app.use(corsConfig)

app.use(rateLimiter)

app.use(requestIdMiddleware)

app.get("/health", (_req, res) => {
    sendSuccessResponse(res, "Healthy", {service: "API-GATEWAY"})
})

app.use("/api/v1", proxyRouter)

app.use(notFound)

app.use(errorHandler)