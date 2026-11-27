import { ResetPasswordSchemaType } from "@/schemas/auth";
import {AuthUser} from "@trustops/shared"

export interface WebStore {
    sidebarCollapse: boolean;
    setSidebarCollapse: (value:boolean) => void;
    toggleSidebar: () => void;
}

export interface AuthStore {
    accessToken: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    isAuthInitialized: boolean;

    setAuthInitialized: (value:boolean) => void;
    setAccessToken: (token:string) => void;
    setUser: (user:AuthUser) => void;
    clearAuth: () => void;

}

export type LoginResponse = {
    accessToken: string
}

export type RegisterResponse = LoginResponse

export type ResetPasswordRequest = {
    token: string
    newPassword: ResetPasswordSchemaType["newPassword"]
}