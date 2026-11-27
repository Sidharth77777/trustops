import { CACHE_TTL_SECONDS } from "../config/constants"
import { AppError } from "../errors/AppError"
import { ErrorCodes } from "../errors/errorCodes"
import { logger } from "../logger/logger"
import { getRedisClient } from "./client"

// check redis key
const validateRedisKey = (cacheKey:string) => {
    if (!cacheKey || !cacheKey.trim()) throw new AppError(404, "Redis key is required", ErrorCodes.NOT_FOUND)
}

// setting and getting of strings
export const setRedisVal = async(cacheKey:string, value:string) => {
    validateRedisKey(cacheKey)
    await getRedisClient().set(cacheKey, value)
}

export const getRedisVal = async(cacheKey:string): Promise<string | null> => {
    validateRedisKey(cacheKey)
    return await getRedisClient().get(cacheKey)
}

// setting of ttl
export const setRedisExpVal = async(
    cacheKey:string, 
    value:string, 
    ttlSeconds:number = CACHE_TTL_SECONDS
) => {
    validateRedisKey(cacheKey)
    if (ttlSeconds <= 0) throw new AppError(400, "Redis TTL must be greater than 0", ErrorCodes.BAD_REQUEST)
    await getRedisClient().setEx(cacheKey, ttlSeconds, value)
}

// setting and getting of JSON objects and also TTL
export const setRedisJson = async<T>(cacheKey:string, value:T) => {
    validateRedisKey(cacheKey)
    await getRedisClient().set(cacheKey, JSON.stringify(value))
}

export const setRedisExpJson = async<T>(
    cacheKey:string, 
    value:T, 
    ttlSeconds: number = CACHE_TTL_SECONDS
) => {
    validateRedisKey(cacheKey)
    if (ttlSeconds <= 0) throw new AppError(400, "Redis TTL must be greater than 0", ErrorCodes.BAD_REQUEST)
    await getRedisClient().setEx(cacheKey, ttlSeconds, JSON.stringify(value))

}

export const getRedisJson = async <T>(cacheKey: string): Promise<T | null> => {
    validateRedisKey(cacheKey)

    const redis = getRedisClient()
    const val = await redis.get(cacheKey)

    if (val === null) return null

    try {
        return JSON.parse(val) as T
    } catch {
        await redis.del(cacheKey)

        throw new AppError(500, `Invalid JSON stored for redis key: ${cacheKey}`, ErrorCodes.INTERNAL_SERVER_ERROR)
    }
}

// deleting 
const deleteRedisVal = async(cacheKey:string) => {
    validateRedisKey(cacheKey)
    await getRedisClient().del(cacheKey)
}

export const invalidateCache = async(cacheKeyPrefix:string, cacheKeySuffix:string, logMsg?:string) => {
    const redisKey = `${cacheKeyPrefix}${cacheKeySuffix}`
    try {
        await deleteRedisVal(redisKey)
    } catch (error){
        logger.error(
            { error, redisKey, cacheKeySuffix },
            logMsg ?? `Failed to invalidate cache on Redis key: ${redisKey}`
        )
    }
}

// checking if key exists -> boolean
export const existsRedisVal = async(cacheKey:string): Promise<boolean> => {
    validateRedisKey(cacheKey)
    const exists = await getRedisClient().exists(cacheKey)
    return exists === 1
}
