import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({
    path: resolve(process.cwd(), "../../.env"),
});

async function runGatewayService() {

    const { logger } = await import("@trustops/shared");
    const { app } = await import("./app.js");
    const { PORTS } = await import("./config/env.js");

    app.listen(PORTS.API_GATEWAY_PORT, () => {
        logger.info(
            `API GATEWAY is listening on PORT ${PORTS.API_GATEWAY_PORT}`
        );
    });
}

runGatewayService().catch((error) => {
    console.error("TRUSTOPS__API-GATEWAY_ERROR:", error);
    process.exit(1)
})