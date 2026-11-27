import {authRoutes} from "./authRoutes"
import { EndpointDefinition } from "./types";

export const endpoints = [
    ...authRoutes,
]

export const endpointsMap = new Map<string, EndpointDefinition>(
    endpoints.map((endpoint) => [
        `${endpoint.method}:${endpoint.path}`,
        endpoint
    ])
)