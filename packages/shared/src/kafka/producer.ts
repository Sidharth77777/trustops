import { Producer } from "kafkajs";
import { createKafkaClient } from "./client";
import { KafkaEventEnvelope } from "@trustops/events";

export const createKafkaProducer = async(clientId:string): Promise<Producer> => {
    const kafkaClient = createKafkaClient(clientId)
    
    const kafkaProducer = kafkaClient.producer()

    await kafkaProducer.connect()
    
    return kafkaProducer
}

export const publishKafkaEvent = async<TType extends string, TData>(
    producer: Producer,
    event: KafkaEventEnvelope<TType, TData>,
    key: string
): Promise<void> => {
    await producer.send({
        topic: event.type,
        messages: [
            {
                key,
                value: JSON.stringify(event)
            }
        ]
    })

}