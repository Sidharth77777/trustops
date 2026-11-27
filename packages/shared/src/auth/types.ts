
export type UserRole = 'USER' | 'ADMIN'

export type JWTPayload = {
    id: string;
    email?: string;
    name?: string;
    is_email_verified: boolean;
    role: UserRole;
    tokenVersion?: number;
}

export type RefreshTokenPayload = {
    id: string;
    tokenVersion: number;
}

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