import { EndpointDefinition } from "./types";

export const authRoutes: EndpointDefinition[] = [
    {
        method: "GET",
        path: "/auth/health",
        authRequired: false,
    },
    {
        method: "POST",
        path: "/auth/register",
        authRequired: false,
    },
    {
        method: "GET",
        path: "/auth/verify-email",
        authRequired: false,
    },
    {
        method: "POST",
        path: "/auth/resend-verification",
        authRequired: false,
    },
    {
        method: "POST",
        path: "/auth/login",
        authRequired: true,
    },
    {
        method: "POST",
        path: "/auth/logout",
        authRequired: true,
    },
    {
        method: "GET",
        path: "/auth/me",
        authRequired: true,
    },
    {
        method: "POST",
        path: "/auth/refresh",
        authRequired: true,
    },
    {
        method: "POST",
        path: "/auth/forgot-password",
        authRequired: true,
    },
    {
        method: "POST",
        path: "/auth/reset-password",
        authRequired: true,
    },
    {
        method: "GET",
        path: "/auth/google",
        authRequired: true,
    },
    {
        method: "GET",
        path: "/auth/google/callback",
        authRequired: true,
    },
    {
        method: "GET",
        path: "/auth/2fa/setup",
        authRequired: true,
    },
    {
        method: "POST",
        path: "/auth/2fa/verify",
        authRequired: true,
    },
    {
        method: "POST",
        path: "/auth/wallet/nonce",
        authRequired: false,
    },
    {
        method: "POST",
        path: "/auth/wallet/login",
        authRequired: false,
    },
    {
        method: "POST",
        path: "/auth/add-email",
        authRequired: true,
    },
];