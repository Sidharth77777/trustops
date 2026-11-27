import { Consumer, EachMessagePayload } from "kafkajs";
import { createKafkaClient } from "./client";

export const createKafkaConsumer = async(
    clientId: string,
    groupId: string
): Promise<Consumer> => {
    const kafkaClient = createKafkaClient(clientId)

    const kafkaConsumer = kafkaClient.consumer({
        groupId,
    })

    await kafkaConsumer.connect()

    return kafkaConsumer
}

export const subscribeToKafkaTopic = async (
    consumer: Consumer,
    topic: string
) => {

    await consumer.subscribe({
        topic,
        fromBeginning: true,
    });

};

export const runKafkaConsumer = async (
    consumer: Consumer,
    handler: (payload: EachMessagePayload) => Promise<void>
) => {

    await consumer.run({
        eachMessage: handler,
    });

};