import { UserRole } from "@trustops/shared"

export type AuthUser = {
    id: string;
    email: string;
    name?: string;
    password_hash?: string,
    image?: string;
    google_id?: string,
    role?: UserRole,
    is_email_verified?: Boolean,
    email_verification_token_hash?: string;
    two_factor_enabled?: Boolean,
    two_factor_secret?: string,
    token_version?: number,
    reset_otp_hash?: string,
    reset_password_expires?: Date,
    created_at?: Date,
    updated_at?: Date
}
export type AuthUserRow = AuthUser

export type SiweNonce = {
    id: string;
    address: string;
    nonce: string;
    expires_at: Date;
    created_at: Date;
}
export type SiweNonceRow = SiweNonce

export type UserWallet = {
    id: string;
    user_id: string;
    address?: string;
    created_at?: string;
}
export type UserWalletRow = UserWallet