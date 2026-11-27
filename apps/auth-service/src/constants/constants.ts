import { APP_URL_PREFIX } from "@trustops/shared"
import { ENV } from "../config/env"

export const APP_URL = ENV.AUTH_SERVICE_URL || `http://localhost:${ENV.AUTH_SERVICE_PORT}${APP_URL_PREFIX}`
export const API_GATEWAY_URL =
    ENV.API_GATEWAY_URL
        ? `${ENV.API_GATEWAY_URL}${APP_URL_PREFIX}`
        : `http://localhost:${ENV.API_GATEWAY_PORT}${APP_URL_PREFIX}`

export const EMAIL_VERIFY_URL_PREFIX = `${APP_URL}/auth/verify-email?token`
export const RESET_PASSWORD_URL_PREFIX = `${APP_URL}/auth/reset-password?token`

export const GOOGLE_OAUTH_REDIRECT_URI = `${API_GATEWAY_URL}/auth/google/callback`

export const RESET_PASSWORD_EXPIRE_TIME = 15 * 60 * 1000  // 15 minutes

export const PASSWORD_SALT = 12

export const COOKIE_KEY = "refreshToken" as const

export const refreshCookieOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // path: "/auth/refresh"
};

export const DB_TABLES = {
    TRUSTOPS_USERS: "trustops_users",
    TRUSTOPS_SIWE_NONCES: "trustops_siwe_nonces",
    TRUSTOPS_USER_WALLETS: "trustops_user_wallets",
    
} as const