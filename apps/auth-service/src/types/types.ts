import { AuthUser, UserRole } from "@trustops/shared"

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

export interface MeUser {
    id: string
    email: string
    name: string
    image: string
    role: UserRole
    is_email_verified: boolean
    two_factor_enabled: boolean
    created_at: Date | string
    updated_at: Date | string
}