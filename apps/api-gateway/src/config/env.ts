import { AppError, ErrorCodes } from "@trustops/shared"

export const checkEnvVariables = (key:string): string => {
    const val = process.env[key]
    if (!val) throw new AppError(500, `Missing ${key} in environment variables`, ErrorCodes.INTERNAL_SERVER_ERROR)
    
    return val
}

export const PORTS = {
    API_GATEWAY_PORT: Number(checkEnvVariables("API_GATEWAY_PORT")) ?? 5000,
}

export const SERVICES = {
    AUTH_SERVICE_URL: checkEnvVariables("AUTH_SERVICE_URL") ?? "http://localhost:5001",
}

export const CORS_ORIGINS = (
    process.env.CORS_ORIGINS || "http://localhost:3000"
).split(",").map((origin) => origin.trim()).filter(Boolean)
