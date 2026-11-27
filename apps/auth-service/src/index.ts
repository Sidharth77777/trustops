import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({
    path: resolve(process.cwd(), "../../.env"),
});

const runAuthService = async () => {
    const { logger, checkPoolHealth, startRedis } = await import("@trustops/shared");
    const { ENV } = await import("./config/env.js");
    const { app } = await import("./app.js");
    const { initializeKafka } = await import("./config/kafka.js")
    const { startOutboxPublisher } = await import("./outbox/publisher.js")

    await checkPoolHealth();
    await startRedis()
    await initializeKafka()
    
    startOutboxPublisher()

    app.listen(ENV.AUTH_SERVICE_PORT, () => {
        logger.info(
            `AUTH SERVICE is listening on PORT ${ENV.AUTH_SERVICE_PORT}`
        );
    });

};

runAuthService().catch(async (error) => {
    console.error("TRUSTOPS__AUTH-SERVICE_ERROR:", error);
    try {
        const { closePool, endRedis } = await import("@trustops/shared");

        await closePool();
        await endRedis();
    } catch (err) {
        console.error("TRUSTOPS__AUTH-SERVICE__CLEANUP_ERROR:", err);
    }

    process.exit(1);
});