export type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

export interface EndpointDefinition {
    method: HttpMethod;
    path: string;

    authRequired?: boolean;

    permissions?: string[];
}