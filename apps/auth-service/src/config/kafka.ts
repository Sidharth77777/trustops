import { Producer } from "kafkajs";
import { AppError, ErrorCodes } from "@trustops/shared";

let kafkaProducer : Promise<Producer> | null = null

export const initializeKafka = async() => {
    const {createKafkaProducer, kafkaProducers, logger} = await import("@trustops/shared")

    kafkaProducer = createKafkaProducer(
        kafkaProducers.TRUSTOPS_AUTH_SERVICE
    )

    logger.info("Kafka connected successfully")    
}

export const getKafkaProducer = (): Promise<Producer> => {
    if (!kafkaProducer) throw new AppError(500, "Kafka producer not initialised yet", ErrorCodes.INTERNAL_SERVER_ERROR)
    
    return kafkaProducer
}