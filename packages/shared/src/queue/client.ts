import IOredis from "ioredis"
import { AppError } from "../errors/AppError"
import { ErrorCodes } from "../errors/errorCodes"

export const createQueueRedisConnection = (): IOredis => {
    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) throw new AppError(500, "Missing REDIS_URL in env", ErrorCodes.INTERNAL_SERVER_ERROR)
    
    return new IOredis(redisUrl, {
        maxRetriesPerRequest: null,
    })
}