import { Admin } from "kafkajs";
import { logger } from "../logger/logger";

export const ensureKafkaTopics = async(
    admin: Admin,
    topics: string[]
): Promise<void> => {
    const existingTopics = await admin.listTopics()

    const missingTopics = topics.filter((topic) => !existingTopics.includes(topic))
    if (missingTopics.length === 0) {
        logger.info("All Kafka topics already exist");
        return;
    }

    await admin.createTopics({
        waitForLeaders: true,
        topics: missingTopics.map((topic) => ({
            topic,
            numPartitions: 1,
            replicationFactor: 1
        }))
    })

    logger.info(
        `Created Kafka topics: ${missingTopics.join(", ")}`
    );
}