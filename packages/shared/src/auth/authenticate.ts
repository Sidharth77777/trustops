import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError"
import { ErrorCodes } from "../errors/errorCodes"
import { verifyAccessToken } from "./jwt"
import { getPool } from "../db/pool"
import { JWTPayload } from "./types"
import { getRedisVal, setRedisExpVal } from "../redis/redis"
import { CACHE_USER_TOKEN_VERSION_KEY_PREFIX, USER_TOKEN_VERSION_CACHE_TTL } from "../redis/keys"

declare global {
    namespace Express {
        interface Request {
            user: JWTPayload
        }
    }
}


export const authenticate = async(req:Request, _res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader?.startsWith("Bearer ")) throw new AppError(401, "Access token is required", ErrorCodes.UNAUTHORIZED)
    
    const token = authHeader.split(" ")[1]

    const payload = verifyAccessToken(token)

    const redisKey = `${CACHE_USER_TOKEN_VERSION_KEY_PREFIX}${payload.id}`
    let redisTokenVersion: string | null = null
    
    try {
        redisTokenVersion = await getRedisVal(redisKey)
    } catch {
        
    }

    if (redisTokenVersion !== String(payload.tokenVersion)) {
        const user = await getPool().query<{token_version:number}>(
            `SELECT token_version
            FROM trustops_users
            WHERE id = $1;
            `, [payload.id]
        )

        const dbUser = user.rows[0];

        if (!dbUser) throw new AppError(401, "Unauthenticated", ErrorCodes.UNAUTHORIZED)
        if (dbUser.token_version !== payload.tokenVersion) throw new AppError(401, "Invalid token", ErrorCodes.UNAUTHORIZED)

        try {
            await setRedisExpVal(redisKey, String(payload.tokenVersion), USER_TOKEN_VERSION_CACHE_TTL)
        } catch {

        }
    }
    
    // const user = await getPool().query<{token_version:number}>(
    //     `SELECT token_version
    //      FROM trustops_users
    //      WHERE id = $1;
    //     `, [payload.id]
    // )

    // const dbUser = user.rows[0];

    // if (!dbUser) throw new AppError(401, "Unauthenticated", ErrorCodes.UNAUTHORIZED)
    // if (dbUser.token_version !== payload.tokenVersion) throw new AppError(401, "Invalid token", ErrorCodes.UNAUTHORIZED)

    req.user = payload

    next()
}