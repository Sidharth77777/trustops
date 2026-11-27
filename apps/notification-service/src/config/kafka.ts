import { AppError, createKafkaConsumer, ErrorCodes, kafkaConsumers } from "@trustops/shared"

let kafkaConsumer: Awaited<ReturnType<typeof createKafkaConsumer>> | null = null

export const initializeKafka = async(): Promise<void> => {
    kafkaConsumer = await createKafkaConsumer(
        kafkaConsumers.TRUSTOPS_NOTIFICATION_SERVICE,
        kafkaConsumers.TRUSTOPS_NOTIFICATION_SERVICE
    )

}

export const getKafkaConsumer = () => {
    if (!kafkaConsumer) throw new AppError(500, "Kafka consumer not initialized yet", ErrorCodes.INTERNAL_SERVER_ERROR)
    return kafkaConsumer
}