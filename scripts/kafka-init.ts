import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({
    path: resolve(process.cwd(), ".env"),
});

const initKafka = async() => {
    const {createKafkaAdmin, ensureKafkaTopics} = await import("@trustops/shared")
    const {KAFKA_TOPICS} = await import("@trustops/events")

    const admin = await createKafkaAdmin(
        "trustops-kafka-init"
    )

    try {
        await ensureKafkaTopics(admin, 
            [...KAFKA_TOPICS]
        )
    } finally {
        await admin.disconnect();
    }
}

initKafka().catch((error) => {
    console.error("Kafka initialization failed:", error);
    process.exit(1);
});