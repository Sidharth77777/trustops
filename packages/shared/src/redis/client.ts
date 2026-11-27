import {createClient} from "redis"
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/errorCodes";
import { logger } from "../logger/logger";

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) throw new AppError(500, "Missing REDIS_URL in env", ErrorCodes.INTERNAL_SERVER_ERROR)

const redisClient = createClient({
    url: REDIS_URL,
})

if (redisClient) {
    redisClient.on("error", (err:unknown) => {
        logger.error(`Redis error: ${err}`);
    });
}

export const startRedis = async() => {
    if (!redisClient.isOpen) {
        await redisClient.connect()
    }

    logger.info('Redis connected successfully');

}

export const getRedisClient = () => redisClient

export const endRedis = async() => {
    if (redisClient.isOpen) {
        await redisClient.quit()
    }

    logger.info('Redis disconnected successfully');

}


