import { AppError, ErrorCodes } from "@trustops/shared"

const checkEnvVariables = (key:string): string => {
    const val = process.env[key]
    if (!val) throw new AppError(500, `Missing ${key} in environment variables`, ErrorCodes.INTERNAL_SERVER_ERROR)
    return val
}

export const ENV = {
    NODE_ENV: checkEnvVariables("NODE_ENV"),

    AUTH_SERVICE_PORT: checkEnvVariables("AUTH_SERVICE_PORT"),
    API_GATEWAY_PORT: checkEnvVariables("API_GATEWAY_PORT"),
    
    AUTH_SERVICE_URL: checkEnvVariables("AUTH_SERVICE_URL"),
    API_GATEWAY_URL: checkEnvVariables("API_GATEWAY_URL"),

    GOOGLE_CLIENT_ID: checkEnvVariables("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: checkEnvVariables("GOOGLE_CLIENT_SECRET"),
    
}