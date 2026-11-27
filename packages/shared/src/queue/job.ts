import { Job, JobsOptions, Queue } from "bullmq";

export const addBullMqJob = async <
    TData,
    TName extends string = string
>(
    queue: Queue<TData, any, TName>,
    name: TName,
    data: TData,
    options?: JobsOptions,
): Promise<Job<TData, any, TName>> => {

    return queue.add(
        name as any,
        data as any,
        options,
    ) as Promise<Job<TData, any, TName>>;
};