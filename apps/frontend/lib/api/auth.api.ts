import { api } from "./axios";
import { ApiResponse, SuccessResponse } from "@trustops/shared";
import { API_ROUTES } from "@/config/proxy";
import { LoginResponse, RegisterResponse, ResetPasswordRequest } from "@/types/types";
import { AuthUser } from "@trustops/shared";
import { EmptyData, getSuccessData } from "@/utils/api-helpers";
import { AddEmailSchemaType, ForgotPasswordSchemaType, LoginSchemaType, RegisterSchemaType, ResendVerificationSchemaType, WalletLoginSchemaType, WalletNonceSchemaType } from "@/schemas/auth";
import { ENV } from "@/config/env";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const LoginApi = async (credentials: LoginSchemaType): Promise<SuccessResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
        `${API_ROUTES.auth}/login`,
        credentials
    );

    return getSuccessData(response.data);
};

export const RegisterApi = async (credentials: RegisterSchemaType): Promise<SuccessResponse<RegisterResponse>> => {
    const response = await api.post<ApiResponse<RegisterResponse>>(
        `${API_ROUTES.auth}/register`,
        credentials
    );
    

    return getSuccessData(response.data);
};

export const ResendVerificationEmailApi = async(input: ResendVerificationSchemaType): Promise<SuccessResponse<EmptyData>> => {
    const response = await api.post<ApiResponse<EmptyData>>(
        `${API_ROUTES.auth}/resend-verification`,
        input
    )

    return getSuccessData(response.data);
}

export const GetMeApi = async (): Promise<SuccessResponse<{ user: AuthUser }>> => {
    const response = await api.get<ApiResponse<{ user: AuthUser }>>(
        `${API_ROUTES.auth}/me`
    );

    return getSuccessData(response.data);
}

export const LogoutApi = async (): Promise<SuccessResponse<EmptyData>> => {
    const response = await api.post<ApiResponse<EmptyData>>(
        `${API_ROUTES.auth}/logout`
    );

    return getSuccessData(response.data);
};

export const ForgotPasswordApi = async (input: ForgotPasswordSchemaType): Promise<SuccessResponse<EmptyData>> => {
    const response = await api.post<ApiResponse<EmptyData>>(
        `${API_ROUTES.auth}/forgot-password`,
        input
    );

    return getSuccessData(response.data);
};

export const ResetPasswordApi = async (input: ResetPasswordRequest): Promise<SuccessResponse<EmptyData>> => {
    const {newPassword, token} = input

    const response = await api.post<ApiResponse<EmptyData>>(
        `${API_ROUTES.auth}/reset-password`,
        { newPassword },
        {
            params: { token }
        }
    )

    return getSuccessData(response.data)
}

export const GoogleRedirectApi = async (): Promise<void> => {
    window.location.href = `${ENV.NEXT_PUBLIC_API_GATEWAY_URL}${API_ROUTES.auth}/google`
}

export const refreshToken = async(setAccessToken: (token: string) => void, router: AppRouterInstance, setError: (error: string | null) => void) => {
    try {
        const res = await api.post(`${API_ROUTES.auth}/refresh`)

        const accessToken = res.data.data.accessToken
        setAccessToken(accessToken)

        router.replace("/dashboard")

    } catch (err) {
        setError(
            err instanceof Error
                ? err.message
                : "Google authentication failed. Please try again."
        )
    }
}

export const WalletNonceApi = async (address: WalletNonceSchemaType): Promise<SuccessResponse<{ nonce: string }>> => {
    const response = await api.post<ApiResponse<{ nonce: string }>>(
        `${API_ROUTES.auth}/wallet/nonce`,
        address 
    )
    
    return getSuccessData(response.data)
}

export const WalletLoginApi = async (credentials: WalletLoginSchemaType): Promise<SuccessResponse<{ accessToken: string, user: AuthUser }>> => {
    const response = await api.post<ApiResponse<{ accessToken: string, user: AuthUser }>>(
        `${API_ROUTES.auth}/wallet/login`,
        credentials 
    )   

    return getSuccessData(response.data)
}

export const AddEmailControllerApi = async (email: AddEmailSchemaType): Promise<SuccessResponse<EmptyData>> => {
    const response = await api.post<ApiResponse<EmptyData>>(
        `${API_ROUTES.auth}/add-email`,
        email 
    )

    return getSuccessData(response.data)
}