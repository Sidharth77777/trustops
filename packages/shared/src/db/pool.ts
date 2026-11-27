import { Pool } from "pg";
import { AppError } from "../errors/AppError";
import { ErrorCodes } from "../errors/errorCodes";
import { logger } from "../logger/logger";

let pool: Pool | null = null

export const getPool = (): Pool => {
    if (!pool) {
        const DB_URL = process.env.DATABASE_URL
        if (!DB_URL) throw new AppError(500, "Missing DATABASE_URL in env", ErrorCodes.INTERNAL_SERVER_ERROR)

        pool = new Pool({
            connectionString: DB_URL
        })

        pool.on("error", (error:Error) => {
            logger.error({error}, "Unexpected PostgreSQL pool error")
        })
    }

    return pool
}

export const checkPoolHealth = async() => {
    await getPool().query(
        `SELECT 1`
    )

    logger.info("DB connected successfully")
}

export const closePool = async() => {
    if (pool) {
        await pool.end()
        pool = null
    }

    logger.info("DB disconnected successfully")
}