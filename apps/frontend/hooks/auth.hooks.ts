import { useMutation } from "@tanstack/react-query";
import * as auth from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import {toastError, toastSuccess} from "@/app/components/common/toast"

export const useAuthLogin = () => {
    const setAccessToken = useAuthStore((state) => state.setAccessToken)

    return useMutation({
        mutationFn: auth.LoginApi,
        onSuccess: (response) => {
            setAccessToken(response.data.accessToken)
            toastSuccess(response.message || "Login successful!")
        },
        onError: (error) => {
            toastError(error.message || "Login failed!")
        },
    })
}

export const useAuthRegister = () => {
    const setAccessToken = useAuthStore((state) => state.setAccessToken)

    return useMutation({
        mutationFn: auth.RegisterApi,
        onSuccess: (response) => {
            setAccessToken(response.data.accessToken)
            toastSuccess(response.message || "User registration successful!")
        },
        onError: (error) => {
            toastError(error.message || "User registration failed!")
        }
    })
}

export const useAuthLogout = () => {
    const clearAuth = useAuthStore((state) => state.clearAuth)

    return useMutation({
        mutationFn: auth.LogoutApi,
        onSuccess: () => {
            toastSuccess("Logout successful!")
        },
        onError: (error) => {
            toastError(error.message || "Logout failed!")
        },
        onSettled: () => {
            clearAuth()
        }
    })
}

export const useAuthForgotPassword = () => {
    return useMutation({
        mutationFn: auth.ForgotPasswordApi,
        onSuccess: (response) => {
            toastSuccess(response.message || "Password reset link sent successfully. Please check your email")
        },
        onError: (error) => {
            toastError(error.message || "Unexpected error on forgot password")
        }
    })
}

export const useAuthResetPassword = () => {
   return useMutation({
        mutationFn: auth.ResetPasswordApi,
        onSuccess: (response) => {
            toastSuccess(response.message || "Password reset successful.. Please login with your new password to continue")
        },
        onError: (error) => {
            toastError(error.message || "Unexpected error on reset password")
        }
    })
}

export const useAuthResendVerificationEmail = () => {
    return useMutation({
        mutationFn: auth.ResendVerificationEmailApi,
        onSuccess: (response) => {
            toastSuccess(response.message || "Verification email resent successfully.. Check your email")
        },
        onError: (error) => {
            toastError(error.message || "Unexpected error on resending verification email")
        }
    })
}

export const useAuthGetMe = () => {
    const setUser = useAuthStore((state) => state.setUser)

    return useMutation({
        mutationFn: auth.GetMeApi,
        onSuccess: (response) => {
            setUser(response.data.user)
        },
        onError: (error) => {
            toastError(error.message || "Unexpected error on fetching user data")
        }
    })
}

export const useAuthGoogleRedirect = () => {
    return useMutation({
        mutationFn: auth.GoogleRedirectApi,
        onError: (error) => {
            toastError(error.message || "Unexpected error on Google redirect")
        }
    })
}

export const useAuthWalletNonce = () => {
    return useMutation({
        mutationFn: auth.WalletNonceApi,
        onError: (error) => {
            toastError(error.message || "Unexpected error on getting wallet nonce")
        }
    })
}

export const useAuthWalletLogin = () => {
    const setAccessToken = useAuthStore((state) => state.setAccessToken)
    const setUser = useAuthStore((state) => state.setUser)  

    return useMutation({
        mutationFn: auth.WalletLoginApi,
        onSuccess: (response) => {
            setAccessToken(response.data.accessToken)
            setUser(response.data.user)
        },
        onError: (error) => {
            toastError(error.message || "Unexpected error on wallet login")
        }
    })
}

export const useAuthAddEmail = () => {
    return useMutation({
        mutationFn: auth.AddEmailControllerApi,
        onSuccess: (response) => {
            toastSuccess(response.message || "Email added successfully")
        },
        onError: (error) => {
            toastError(error.message || "Unexpected error on adding email")
        }
    })
}