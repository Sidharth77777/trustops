import { Request, Response } from "express"
import { AddEmailSchemaType, ForgotPasswordSchemaType, LoginSchemaType, RegisterSchemaType, ResendVerificationSchemaType, ResetPasswordSchemaType, WalletLoginSchemaType, WalletNonceSchemaType } from "../schemas/auth.schema"
import * as authService from "../services/auth.service"
import { AppError, ErrorCodes, sendFailResponse, sendSuccessResponse } from "@trustops/shared"
import { COOKIE_KEY, refreshCookieOptions } from "../constants/constants"
import { ENV } from "../config/env"

export const registerController = async(req:Request, res:Response) => {
    const {email, name, password} = req.body as RegisterSchemaType

    const {accessToken, refreshToken} = await authService.registerService({ email, name, password })

    res.cookie(COOKIE_KEY, refreshToken, refreshCookieOptions)

    sendSuccessResponse(res, "User registered successfully...Please check your email for verification link", { accessToken }, 201)

}

export const verfiyEmailController = async(req:Request, res:Response) => {
    const token  = req.query.token
    if (typeof token !== "string" || !token) {
        return sendFailResponse(res, "Invalid verification url")
    }
    
    await authService.verifyEmailService(token)

    sendSuccessResponse(res, "Email verified successfully", {})
}

export const resendVerificationController = async(req:Request, res:Response) => {
    const {email} = req.body as ResendVerificationSchemaType

    await authService.resendVerificationService({ email })

    sendSuccessResponse(res, "Verification email resent successfully.. Check your email", {})
}

export const loginController = async(req:Request, res:Response) => {
    const {email, password} = req.body as LoginSchemaType

    const {accessToken, refreshToken} = await authService.loginService({ email, password })

    res.cookie(COOKIE_KEY, refreshToken, refreshCookieOptions)

    sendSuccessResponse(res, "Login successful", { accessToken })
}

export const logoutController = async(req:Request, res:Response) => {
    const refreshToken = req.cookies[COOKIE_KEY]
    if (!refreshToken) throw new AppError(401, "Refresh token absent", ErrorCodes.UNAUTHORIZED)

    await authService.logoutService(refreshToken)

    res.clearCookie(COOKIE_KEY, refreshCookieOptions);

    // remove jwt from frontend localstorage too !!!

    sendSuccessResponse(res, "Logout successful", {})
}

export const getMeController = async(req:Request, res:Response) => {
    const user = req?.user
    if (!user) throw new AppError(401, "Not authenticated", ErrorCodes.UNAUTHORIZED)

    const userData = await authService.getMeService(user)

    sendSuccessResponse(res, "User data retrieved successfully", { user: userData })
}

export const refreshController = async(req:Request, res:Response) => {
    const oldRefreshToken = req.cookies[COOKIE_KEY]
    if (!oldRefreshToken) throw new AppError(401, "Refresh token absent", ErrorCodes.UNAUTHORIZED)

    const {accessToken, refreshToken} = await authService.refreshService(oldRefreshToken)

    res.cookie(COOKIE_KEY, refreshToken, refreshCookieOptions)

    sendSuccessResponse(res, "Access token refreshed", { accessToken })
}

export const forgotPasswordController = async(req:Request, res:Response) => {
    const {email} = req.body as ForgotPasswordSchemaType

    await authService.forgotPasswordService({ email })

    sendSuccessResponse(res, "Password reset link sent successfully. Please check your email", {})
}

export const resetPasswordController = async(req:Request, res:Response) => {
    const token  = req.query.token
    if (typeof token !== "string" || !token) {
        return sendFailResponse(res, "Invalid reset password url")
    }
    const {newPassword} = req.body as ResetPasswordSchemaType

    await authService.resetPasswordService(token, { newPassword })

    sendSuccessResponse(res, "Password reset successful.. Please login with your new password to continue", {})
}

export const googleRedirectController = (_req:Request, res:Response) => {
    const redirectUri = authService.redirectGoogleService()

    res.redirect(redirectUri)
}

export const googleAuthCallbackController = async(req:Request, res:Response) => {
    const code = req.query.code as string
    if (!code || typeof code === "undefined") throw new AppError(400, "Missing code in google callback", ErrorCodes.BAD_REQUEST)

    const {accessToken, refreshToken} = await authService.googleAuthCallbackService(code)

    res.cookie(COOKIE_KEY, refreshToken, refreshCookieOptions)

    return res.redirect(
        `${ENV.CORS_ORIGINS}/google/callback`
    )
}

export const twoFASetupController = async(req:Request, res:Response) => {
    const user = req?.user
    if (!user) throw new AppError(401, "Not authenticated", ErrorCodes.UNAUTHORIZED)
    
    const {otpAuthUri, secret, qrCode} = await authService.twoFAService(user)

    sendSuccessResponse(res, "2FA setup is done", {otpAuthUri, secret, qrCode})
}

export const twoFAVerifyController = async(req:Request, res:Response) => {
    const user = req?.user
    if (!user) throw new AppError(401, "Not authenticated", ErrorCodes.UNAUTHORIZED)
    const {code} = req.body as {code:string}
    if (!code) throw new AppError(400, "Two factor code is required", ErrorCodes.BAD_REQUEST)
    
    await authService.twoFAVerifyService(user, code)
    
    sendSuccessResponse(res, "2FA enabled successfully", {})

}

export const walletNonceController = async(req:Request, res:Response) => {
    const {address} = req.body as WalletNonceSchemaType

    const nonce = await authService.walletNonceService({address})
    
    sendSuccessResponse(res, "Nonce created successfully", nonce)
}

export const walletLoginController = async(req:Request, res:Response) => {
    const {address, message, signature} = req.body as WalletLoginSchemaType

    const {accessToken, refreshToken, user} = await authService.walletLoginService({ address, message, signature })

    res.cookie(COOKIE_KEY, refreshToken, refreshCookieOptions)

    sendSuccessResponse(res, "Wallet login successful", {accessToken, user})
}

export const addEmailController = async(req:Request, res:Response) => {
    const {email} = req.body as AddEmailSchemaType

    const user = req?.user
    if (!user) throw new AppError(401, "Not authenticated", ErrorCodes.UNAUTHORIZED)

    await authService.addEmailService(user, {email})

    sendSuccessResponse(res, "Verification email sent successfully", {})

}