import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({
    path: resolve(process.cwd(), "../../.env"),
});

const runNotificationService = async() => {
    const {logger, startRedis} = await import("@trustops/shared")
    const {initializeKafka} = await import("./config/kafka.js")
    const {initialiseKafkaConsumers} = await import("./consumers/index.js")
    const {startWorkers} = await import("./workers/index.js")

    await startRedis()

    await initializeKafka()
    await initialiseKafkaConsumers()
    await startWorkers()

    logger.info("TRUSTOPS__NOTIFICATION-SERVICE started successfully")

}

runNotificationService().catch(async(error) => {
    console.error("TRUSTOPS__NOTIFICATION-SERVICE_ERROR:", error)

    try {
        const {endRedis} = await import("@trustops/shared")
        await endRedis()

    } catch (err) {
        console.error("TRUSTOPS__NOTIFICATION-SERVICE__CLEANUP_ERROR:", err)
    }

    process.exit(1)
})