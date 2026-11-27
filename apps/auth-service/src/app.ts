import express from "express"
import cookieParser from "cookie-parser"
import { sendSuccessResponse, notFound, errorHandler, requestIdMiddleware } from "@trustops/shared"
import { authRouter } from "./routes"

export const app = express()

app.use(cookieParser())

app.use(express.json())

app.use(requestIdMiddleware)

app.get("/health", (_req, res) => {
    sendSuccessResponse(res, "Healthy", {service: "AUTH-SERVICE"})
})

app.use("/auth", authRouter)

app.use(notFound)

app.use(errorHandler)

