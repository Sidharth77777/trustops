import {PoolClient} from "pg"
import { getPool } from "./pool"
import { logger } from "../logger/logger"

export const withTransaction = async<T>(
    callback: (client:PoolClient) => Promise<T> 
): Promise<T> => {
    const client = await getPool().connect()

    try {
        await client.query("BEGIN")

        const result = await callback(client)

        await client.query("COMMIT")

        return result

    } catch (err) {
        try {
            await client.query("ROLLBACK")
        } catch (rollbackErr) {
            logger.error({rollbackErr}, "Transaction rollback failed:");
        }
        throw err
    } finally {
        client.release()
    }

}