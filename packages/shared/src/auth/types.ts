
export type UserRole = 'USER' | 'ADMIN'

export type JWTPayload = {
    id: string;
    email?: string;
    name?: string;
    is_email_verified: boolean;
    role: UserRole;
    tokenVersion: number;
}

export type RefreshTokenPayload = {
    id: string;
    tokenVersion: number;
}