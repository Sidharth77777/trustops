import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError"
import { ErrorCodes } from "../errors/errorCodes"
import { verifyAccessToken } from "./jwt"
import { getPool } from "../db/pool"
import { JWTPayload } from "./types"

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
    
    const user = await getPool().query<{token_version:number}>(
        `SELECT token_version
         FROM trustops_users
         WHERE id = $1;
        `, [payload.id]
    )

    if (!user) throw new AppError(401, "Unauthenticated", ErrorCodes.UNAUTHORIZED)
    if (user.rows[0].token_version !== payload.tokenVersion) throw new AppError(401, "Invalid token", ErrorCodes.UNAUTHORIZED)

    req.user = payload

    next()
}