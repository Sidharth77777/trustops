import { AppError, CACHE_USER_PROFILE_KEY_PREFIX, checkContext, createOutboxEvent, ErrorCodes, invalidateCache, JWTPayload, signBothJWTTokens, UserRole, verifyRefreshToken, withTransaction} from "@trustops/shared"
import { AddEmailSchemaType, ForgotPasswordSchemaType, LoginSchemaType, RegisterSchemaType, ResendVerificationSchemaType, ResetPasswordSchemaType, WalletLoginSchemaType, WalletNonceSchemaType } from "../schemas/auth.schema";
import * as authRepo from "../repositories/auth.repository"
import { EMAIL_VERIFY_URL_PREFIX, RESET_PASSWORD_EXPIRE_TIME, RESET_PASSWORD_URL_PREFIX } from "../constants/constants";
import { createKafkaEvent, USER_PASSWORD_RESET_REQUESTED_EVENT, USER_REGISTERED_EVENT, USER_VERIFICATION_REQUESTED_EVENT } from "@trustops/events";
import { comparePasswordHashes, createHash, createNonce, createRandomPassword, createToken, hashPassword } from "../utils/utils";
import { generateGoogleOAuthRedirectUri, googleOAuthClient } from "../config/googleOAuth";
import { ENV } from "../config/env";
import { TokenPayload } from "google-auth-library";
import { generateQRCode, twoFAHelper, twoFAVerifier } from "../lib/otp";
import { SiweMessage } from "siwe";
import { verifySiwe } from "../lib/siwe";
import { MeUser } from "../types/types";

export const registerService = async(input:RegisterSchemaType): Promise<{accessToken:string, refreshToken:string}> => {
    const context = checkContext()

    const existingUser = await authRepo.findUserByEmail(input.email)
    if (existingUser) throw new AppError(409, "User already registered", ErrorCodes.CONFLICT)
    
    const passwordHash = await hashPassword(input.password)

    const result = await withTransaction(async(client) => {
        const newUser = await authRepo.createUser(client ,input.email, input.name, passwordHash)

        const {accessToken, refreshToken} = signBothJWTTokens({
            id: newUser.id,
            email: newUser.email,
            name: String(newUser.name),
            is_email_verified: newUser.is_email_verified as boolean,
            role: newUser.role as UserRole,
            tokenVersion: Number(newUser.token_version)
        })
        
        const verificationToken = createToken()

        const verificationTokenHash = createHash(verificationToken)

        await authRepo.storeEmailVerificationTokenHash(client, verificationTokenHash, newUser.id)

        const verifyUrl = `${EMAIL_VERIFY_URL_PREFIX}=${verificationToken}`

        const event = createKafkaEvent(USER_REGISTERED_EVENT, {
            userId: newUser.id,
            email: newUser.email,
            name: String(newUser.name),
            verificationUrl: verifyUrl
        },
        context.correlationId
    )

        await createOutboxEvent(client, event.type, newUser.id, event)

        return { accessToken, refreshToken }
    })
    
    return result

}

export const verifyEmailService = async(token:string): Promise<void> => {
    const hash = createHash(token)

    const existingUser = await authRepo.findUserByVerificationToken(hash)
    if (!existingUser) return
    if (existingUser.is_email_verified) throw new AppError(400, "Email already verified!", ErrorCodes.BAD_REQUEST)

    await authRepo.markEmailAsVerified(existingUser.id)

}

export const resendVerificationService = async(input:ResendVerificationSchemaType): Promise<void> => {
    const context = checkContext()

    const existingUser = await authRepo.findUserByEmail(input.email)
    if (!existingUser) return
    if (existingUser.is_email_verified) throw new AppError(400, "Email already verified!", ErrorCodes.BAD_REQUEST)

    await withTransaction(async(client) => {
        const verificationToken = createToken()

        const verificationTokenHash = createHash(verificationToken)

        await authRepo.storeEmailVerificationTokenHash(client, verificationTokenHash, existingUser.id)

        const verifyUrl = `${EMAIL_VERIFY_URL_PREFIX}=${verificationToken}`

        const event = createKafkaEvent(USER_VERIFICATION_REQUESTED_EVENT, {
            userId: existingUser.id,
            email: existingUser.email,
            name: String(existingUser.name),
            verificationUrl: verifyUrl
        },
            context.correlationId
        )

        await createOutboxEvent(client, event.type, existingUser.id, event)
    })
}

export const loginService = async(input:LoginSchemaType): Promise<{accessToken:string, refreshToken:string}> => {

    const existingUser = await authRepo.findUserByEmail(input.email)
    if (!existingUser) throw new AppError(401, "Invalid email or password", ErrorCodes.UNAUTHORIZED)

    const isPasswordValid = await comparePasswordHashes(input.password, existingUser.password_hash as string)
    if (!isPasswordValid) throw new AppError(401, "Invalid email or password", ErrorCodes.UNAUTHORIZED)

    if (!existingUser.is_email_verified) throw new AppError(403, "Your email is not verified.. Please verify your email or request a new verification email or check your gmail for a verification link", ErrorCodes.FORBIDDEN)
    
    const {accessToken, refreshToken} = signBothJWTTokens({
        id: existingUser.id,
        email: existingUser.email,
        name: String(existingUser.name),
        is_email_verified: existingUser.is_email_verified as boolean,
        role: existingUser.role as UserRole,
        tokenVersion: Number(existingUser.token_version)
    })

    return {
        accessToken,
        refreshToken,
    }
}

export const logoutService = async (refreshToken: string | undefined): Promise<void> => {

    if (!refreshToken) return

    let payload;

    try {
        payload = verifyRefreshToken(refreshToken);
    } catch {
        // Already invalid/expired.
        // Logout should still succeed.
        return
    }

    await authRepo.incrementTokenVersion(payload.id);
};

export const getMeService = async(authUser:JWTPayload): Promise<MeUser | null> => {
    const user = await authRepo.findMeUserById(authUser.id)
    if (!user) throw new AppError(404, "User not found", ErrorCodes.NOT_FOUND)

    return user
}

export const refreshService = async(token:string): Promise<{accessToken:string, refreshToken:string}> => {
    const payload = verifyRefreshToken(token)

    const user = await authRepo.findUserById(payload.id)
    if (!user) throw new AppError(401, "User not found", ErrorCodes.UNAUTHORIZED)
    if (!user.is_email_verified) throw new AppError(403, "Email not verified", ErrorCodes.FORBIDDEN)
    if (user.token_version !== payload.tokenVersion) throw new AppError(401, "Invalid refresh token", ErrorCodes.UNAUTHORIZED)
    
    const {accessToken, refreshToken} = signBothJWTTokens({
        id: user.id,
        email: user.email,
        name: user.name ?? "",
        is_email_verified: user.is_email_verified as boolean,
        role: user.role as UserRole,
        tokenVersion: Number(user.token_version) 
    })

    return {
        accessToken,
        refreshToken
    }
}

export const forgotPasswordService = async(input:ForgotPasswordSchemaType): Promise<void> => {
    const context = checkContext()

    const user = await authRepo.findUserByEmail(input.email)
    if (!user) throw new AppError(400, "Check your email for a reset password link", ErrorCodes.BAD_REQUEST)

    const rawToken = createToken()
    const rawTokenHash = createHash(rawToken)
    const resetPasswordExpires = new Date(Date.now() + RESET_PASSWORD_EXPIRE_TIME)
    const resetUrl = `${RESET_PASSWORD_URL_PREFIX}=${rawToken}`

    await withTransaction(async(client) => {
        await authRepo.updateForgotPassword(client, input.email, rawTokenHash, resetPasswordExpires)

        // send kafka event
        const event = createKafkaEvent(USER_PASSWORD_RESET_REQUESTED_EVENT, {
            userId: user.id,
            email: user.email,
            name: user.name ?? "",
            resetPasswordUrl: resetUrl
        },
            context.correlationId
        )

        await createOutboxEvent(client, event.type, user.id, event)

    })
}

export const resetPasswordService = async(token:string, input:ResetPasswordSchemaType): Promise<void> => {
    const hash = createHash(token)
    const existingUser = await authRepo.findUserByResetTokenHash(hash)
    if (!existingUser) throw new AppError(400, "Invalid reset link", ErrorCodes.BAD_REQUEST)
    if (!existingUser.reset_password_expires || new Date() > existingUser.reset_password_expires) throw new AppError(400, "Password reset expired",ErrorCodes.BAD_REQUEST)
    
    const isPasswordsSame = await comparePasswordHashes(input.newPassword, existingUser.password_hash!)
    if (isPasswordsSame) throw new AppError(400, "New password must be different", ErrorCodes.BAD_REQUEST)

    const newPasswordHash = await hashPassword(input.newPassword)
    
    await authRepo.resetPasswordById(newPasswordHash, existingUser.id)
}

export const redirectGoogleService = () => {
    return generateGoogleOAuthRedirectUri()
}

export const googleAuthCallbackService = async(code:string): Promise<{accessToken:string, refreshToken:string}> => {
    const {tokens} = await googleOAuthClient.getToken(code)
    if (!tokens.id_token) throw new AppError(400, "No google id token is present", ErrorCodes.BAD_REQUEST)
    
    const ticket = await googleOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: ENV.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()

    const {email, email_verified, name, picture, sub} = payload as TokenPayload
    if (!email || !email_verified || !sub) throw new AppError(400, "Google email account is not verified", ErrorCodes.BAD_REQUEST)

    const normalisedEmail = email.toLowerCase().trim()
    let user = await authRepo.findUserByEmail(normalisedEmail)

    if (user) {
        if (!user.is_email_verified) await authRepo.markEmailAsVerified(user.id)
        await authRepo.linkGoogleAccount(user.id, sub)

    } else {
        const randomPassword = createRandomPassword()
        const randomPasswordHash = await hashPassword(randomPassword)

        user = await authRepo.createNewUserFromGoogle(normalisedEmail, name ?? "USER", randomPasswordHash, picture ?? "", sub)
    }

    const {accessToken, refreshToken} = signBothJWTTokens({
        id: user.id,
        email: user.email,
        name: user.name ?? "",
        is_email_verified: user.is_email_verified as boolean,
        role: user.role as UserRole,
        tokenVersion: Number(user.token_version)

    })

    return {
        accessToken,
        refreshToken
    }
    
}

export const twoFAService = async(authUser:JWTPayload): Promise<{otpAuthUri:string, secret:string, qrCode:string}> => {
    const user = await authRepo.findUserById(authUser.id)
    if (!user) throw new AppError(404, "User not found", ErrorCodes.NOT_FOUND)

    const {secret, otpAuthUri} = twoFAHelper(user.email)

    const qrCode = await generateQRCode(otpAuthUri)

    console.log("SAVING SECRET TO DATABASE:", secret)

    await authRepo.markTwoFA(secret, user.id)

    return {
        otpAuthUri,
        secret,
        qrCode
    }
}

export const twoFAVerifyService = async(authUser:JWTPayload, code:string): Promise<void> => {
    const user = await authRepo.findUserById(authUser.id)
    if (!user) throw new AppError(404, "User not found", ErrorCodes.NOT_FOUND)
    if (!user.two_factor_secret) throw new AppError(403, "You dont have 2FA setup yet", ErrorCodes.FORBIDDEN)

    console.log("DATABASE SECRET:", user.two_factor_secret)
    
    const isValid = await twoFAVerifier(code, user.two_factor_secret)
    if (!isValid) throw new AppError(403, "Invalid two factor code", ErrorCodes.FORBIDDEN)
    
    await authRepo.mark2FaAsEnabled(user.id)

}

export const walletNonceService = async(input:WalletNonceSchemaType): Promise<{nonce:string} | null> => {
    const newNonce = createNonce()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    const nonce = await authRepo.createNonce(input.address, newNonce, expiresAt)

    return nonce ? { nonce: nonce.nonce } : null
}

export const walletLoginService = async(input:WalletLoginSchemaType): Promise<{accessToken:string, refreshToken:string, user:JWTPayload}> => {
    const siweMessage = new SiweMessage(input.message)
    if (siweMessage.address.toLowerCase().trim() !== input.address) throw new AppError(401, "Wallet address mismatch", ErrorCodes.UNAUTHORIZED)

    const nonceRecord = await authRepo.findNonce(input.address, siweMessage.nonce)
    if (!nonceRecord) throw new AppError(401, "Invalid or expired SIWE nonce", ErrorCodes.UNAUTHORIZED)
    
    const isValidMessage = await verifySiwe(input.message, input.signature)
    if (!isValidMessage) throw new AppError(401, "Error verifying wallet address", ErrorCodes.UNAUTHORIZED)

    let wallet = await authRepo.findUserByWalletAddress(input.address)

    if (!wallet) {
        await withTransaction(async(client) => {
            const userId = await authRepo.createUserByWalletAddress(client)
            if (!userId) throw new AppError(401, "Invalid user or wallet", ErrorCodes.UNAUTHORIZED)
            
            wallet = await authRepo.createUserWallet(client, userId, input.address)
            if (!wallet) throw new AppError(401, "Failed creating wallet", ErrorCodes.UNAUTHORIZED)
        
        })
    }
    if (!wallet?.user_id) throw new AppError(401, "Failed creating wallet", ErrorCodes.UNAUTHORIZED)

    const user = await authRepo.findUserById(wallet.user_id)
    if (!user) throw new AppError(401, "Invalid user or wallet", ErrorCodes.UNAUTHORIZED)

    // jwt and refresh tokens
    const {accessToken, refreshToken} = signBothJWTTokens({
        id: user.id,
        email: user.email,
        name: user.name ?? "",
        is_email_verified: user.is_email_verified as boolean,
        role: user.role as UserRole,
        tokenVersion: Number(user.token_version)
    })
   
    await authRepo.deleteNonce(nonceRecord.id)

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            is_email_verified: user.is_email_verified as boolean,
            role: user.role as UserRole,
        }
    }
}

export const addEmailService = async(authUser:JWTPayload, input:AddEmailSchemaType): Promise<void> => {
    const context = checkContext()

    const existingEmailUser = await authRepo.findUserByEmail(input.email)
    if (existingEmailUser && existingEmailUser.id !== authUser.id) throw new AppError(409, "Email already registered", ErrorCodes.CONFLICT)

    const user = await authRepo.findUserById(authUser.id)
    if (!user) throw new AppError(404, "User not found", ErrorCodes.NOT_FOUND)
    if (user.email && user.is_email_verified) throw new AppError(400, "Your account already has a verified email", ErrorCodes.BAD_REQUEST)
    if (existingEmailUser && existingEmailUser.id !== authUser.id) throw new AppError(409, "This email is already registered", ErrorCodes.CONFLICT)

    await withTransaction(async (client) => {

        await authRepo.updateUserEmail(client, authUser.id, input.email)

        await invalidateCache(CACHE_USER_PROFILE_KEY_PREFIX, authUser.id, "Failed to invalidate user profile cache")

        const verificationToken = createToken()
        const verificationTokenHash = createHash(verificationToken)

        await authRepo.storeEmailVerificationTokenHash(client, verificationTokenHash, authUser.id)

        const verifyUrl =
            `${EMAIL_VERIFY_URL_PREFIX}=${verificationToken}`

        const event = createKafkaEvent(
            USER_VERIFICATION_REQUESTED_EVENT,
            {
                userId: user.id,
                email: input.email,
                name: user.name ?? "",
                verificationUrl: verifyUrl
            },
            context.correlationId
        )

        await createOutboxEvent(client, event.type, authUser.id, event)
    })

}