import {z} from "zod"

export const registerSchema = z.object({
    email: z.string().trim().lowercase().email("Invalid email address"),
    name: z.string().trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be at most 128 characters")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        )
})

export const loginSchema = z.object({
    email: z.string().trim().lowercase().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be at most 128 characters")
})

export const resendVerificationSchema = z.object({
    email: z.string().trim().lowercase().email("Invalid email address"),
})

export const forgotPasswordSchema = resendVerificationSchema

export const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be at most 128 characters")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        )
})

export const walletNonceSchema = z.object({
    address: z.string()
        .trim().lowercase()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
})

export const walletLoginSchema = z.object({
    address: z.string()
        .trim().lowercase()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
    message: z.string().min(10, "Invalid SIWE message"),
    signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, "Invalid ECDSA signature"),
})

export const addEmailSchema = resendVerificationSchema

export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>
export type ResendVerificationSchemaType = z.infer<typeof resendVerificationSchema>
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>

export type WalletNonceSchemaType = z.infer<typeof walletNonceSchema>
export type WalletLoginSchemaType = z.infer<typeof walletLoginSchema>

export type AddEmailSchemaType = z.infer<typeof addEmailSchema>
