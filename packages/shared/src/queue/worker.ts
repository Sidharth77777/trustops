import { Processor, Worker, WorkerOptions } from "bullmq";
import { createQueueRedisConnection } from "./client";

export const createBullMqQueueWorker = <T=unknown>(
    queueName: string,
    processor: Processor<T>,
    options: Partial<WorkerOptions> = {}
): Worker<T> => {
    
    const connection = createQueueRedisConnection()

    return new Worker(queueName, processor, {
        connection,
        ...options,
    })

}