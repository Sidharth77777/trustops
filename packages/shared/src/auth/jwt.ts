import jwt from "jsonwebtoken"
import { JWTPayload, RefreshTokenPayload } from "./types";
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/errorCodes";

export const signAccessToken = (payload:JWTPayload): string => {
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
    if (!JWT_ACCESS_SECRET) throw new AppError(500, "Missing JWT_ACCESS_SECRET in env", ErrorCodes.INTERNAL_SERVER_ERROR)
    const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN
    if (!JWT_ACCESS_EXPIRES_IN) throw new AppError(500, "Missing JWT_ACCESS_EXPIRES_IN in env", ErrorCodes.INTERNAL_SERVER_ERROR)

    return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    })
}

export const verifyAccessToken = (token:string): JWTPayload => {
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
    if (!JWT_ACCESS_SECRET) throw new AppError(500, "Missing JWT_ACCESS_SECRET in env", ErrorCodes.INTERNAL_SERVER_ERROR)

    return jwt.verify(token, JWT_ACCESS_SECRET) as JWTPayload
}

export const signRefreshToken = (payload:RefreshTokenPayload): string => {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
    if (!JWT_REFRESH_SECRET) throw new AppError(500, "Missing JWT_REFRESH_SECRET in env", ErrorCodes.INTERNAL_SERVER_ERROR)
    const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN
    if (!JWT_REFRESH_EXPIRES_IN) throw new AppError(500, "Missing JWT_REFRESH_EXPIRES_IN in env", ErrorCodes.INTERNAL_SERVER_ERROR)

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    })
}

export const verifyRefreshToken = (token:string): RefreshTokenPayload => {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
    if (!JWT_REFRESH_SECRET) throw new AppError(500, "Missing JWT_REFRESH_SECRET in env", ErrorCodes.INTERNAL_SERVER_ERROR)

    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload
}

export const signBothJWTTokens = (payload:JWTPayload): {accessToken:string, refreshToken:string} => {
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken({
        id: payload.id,
        tokenVersion: payload.tokenVersion
    })

    return {
        accessToken,
        refreshToken
    }
}
