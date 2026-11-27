import {Kafka, KafkaConfig, logLevel} from "kafkajs"
import { AppError } from "../errors/AppError"
import { ErrorCodes } from "../errors/errorCodes"

export const createKafkaClient = (
    clientId: string,
    config: Partial<KafkaConfig> = {}
) => {
    const brokerUrls = process.env.KAFKA_BROKERS || "localhost:9092"
    if (!brokerUrls) throw new AppError(500, "Missing kafka brokers in env", ErrorCodes.INTERNAL_SERVER_ERROR)

    const brokers = brokerUrls.split(",").map((broker) => broker.trim()).filter(Boolean)
    if (brokers.length === 0) throw new AppError(500, "Kafka brokers are empty", ErrorCodes.INTERNAL_SERVER_ERROR)

    return new Kafka({
        clientId,
        brokers,
        logLevel: logLevel.ERROR,
        retry : {
            retries: 8
        },
        ...config
    })

}
