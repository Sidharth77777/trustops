import { logger } from "./../logger/logger"

interface CacheAsideOptions<T> {
    redisKey: string
    ttl: number
    getCache: (key: string) => Promise<T | null>                            // getRedisVal() or getRedisJson()

    fetchDataFromDB: () => Promise<T | null>

    setCache: (key: string, value: T, ttl?: number) => Promise<void>         // setRedisVal() or setRedisExpJson() or setRedisJson() 

    logContext?: Record<string, unknown>
}

export const getCacheOrFetchFromDB = async <T>({
    redisKey,
    ttl=300,
    getCache,
    fetchDataFromDB,
    setCache,
    logContext = {}
}: CacheAsideOptions<T>): Promise<T | null> => {

    // Check Redis
    try {
        const cachedData = await getCache(redisKey)

        if (cachedData !== null) {
            // logger.info(`CACHE HIT: ${redisKey}`)
            // logger.info(`CACHE HIT DATA: ${cachedData}`)
            return cachedData
        }
    } catch (error) {
        logger.error(
            { error, redisKey, ...logContext },
            "Failed to retrieve Redis cache"
        )
    }

    // Cache miss - fetch from database
    const data = await fetchDataFromDB()

    if (data === null) return null
    // logger.info(`DB HIT DATA: ${data}`)

    // Store in Redis
    try {
        await setCache(redisKey, data, ttl)
        // logger.info("CACHE STORED IN REDIS")
    } catch (error) {
        logger.error(
            { error, redisKey, ...logContext },
            "Failed to store Redis cache"
        )
    }

    return data
}
