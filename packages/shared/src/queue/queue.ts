import { Queue, QueueOptions } from "bullmq";
import { createQueueRedisConnection } from "./client";

export const createBullMqQueue = <T = unknown>(
    name: string,
    options: Partial<QueueOptions> = {},
): Queue<T, any, string> => {

    const connection = createQueueRedisConnection();

    return new Queue<T, any, string>(name, {
        connection,
        ...options,
    });
};