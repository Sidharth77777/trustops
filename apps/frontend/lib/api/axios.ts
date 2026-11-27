
import axios, { InternalAxiosRequestConfig } from "axios"
import { ENV } from "../../config/env"
import { useAuthStore } from "@/store/auth.store"
import { API_ROUTES } from "@/config/proxy"
import { parseZodError } from "@/utils/parseZodError"

declare module "axios" {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean
    }
}

const baseURL = ENV.NEXT_PUBLIC_API_GATEWAY_URL

if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_GATEWAY_URL is not defined")
}

// Main API instance
export const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

// Separate refresh instance (no auth interceptors)
const refreshClient = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export const refreshSession = async (): Promise<string> => {
    const response = await refreshClient.post(
        `${API_ROUTES.auth}/refresh`
    )

    const accessToken = response.data.data.accessToken

    if (typeof accessToken !== "string" || !accessToken) {
        throw new Error("Invalid access token received")
    }

    useAuthStore.getState().setAccessToken(accessToken)

    return accessToken
}

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken

        if (accessToken) {
            config.headers.set("Authorization", `Bearer ${accessToken}`)
        }

        return config
    },
    (error) => Promise.reject(error)
)

// Prevent concurrent refresh requests
let refreshPromise: Promise<string> | null = null

// Response interceptor
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response?.data?.message) {
                error.message = error.response.data.message
            }

            if (
                error.response?.status === 400 &&
                error.response?.data?.message === "Validation failed"
            ) {
                error.message = parseZodError(error)
            }
        }

        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/refresh") ||
            originalRequest.url?.includes("/auth/login")
        ) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        try {
            if (!refreshPromise) {
                refreshPromise = refreshClient
                    .post(`${API_ROUTES.auth}/refresh`)
                    .then((res) => {
                        const token = res.data.data.accessToken

                        if (typeof token !== "string" || !token) {
                            throw new Error("Invalid access token received")
                        }

                        useAuthStore.getState().setAccessToken(token)

                        return token
                    })
                    .finally(() => {
                        refreshPromise = null
                    })
            }

            const token = await refreshPromise

            originalRequest.headers.set(
                "Authorization",
                `Bearer ${token}`
            )

            return api(originalRequest)

        } catch (refreshError) {
            if (
                axios.isAxiosError(refreshError) &&
                [401, 403].includes(refreshError.response?.status ?? 0)
            ) {
                useAuthStore.getState().clearAuth()
            }

            return Promise.reject(refreshError)
        }
    }
)
