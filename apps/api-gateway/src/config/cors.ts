import cors from "cors"
import { CORS_ORIGINS } from "./env"
import { HEADERS } from "@trustops/shared"

export const corsConfig = cors({
    origin: CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        HEADERS.x_request_id,
        HEADERS.x_correlation_id,
    ],
    exposedHeaders: [
        HEADERS.x_request_id,
        HEADERS.x_correlation_id,
    ]
})