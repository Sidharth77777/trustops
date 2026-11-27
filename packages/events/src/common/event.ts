import crypto from "node:crypto"
import { KafkaEventMap } from "../auth-events/events";

export const KafkaEventVersion = 1

export type KafkaEventEnvelope <TType extends string, TData> = {
    eventId: string;
    type: TType;
    version: number;
    occurredAt: string;
    correlationId: string;
    data: TData;
}

export const createKafkaEvent = <
    TType extends keyof KafkaEventMap
>(
    type: TType,
    data: KafkaEventMap[TType],
    correlationId: string,
    version = 1
): KafkaEventEnvelope<TType, KafkaEventMap[TType]> => ({
    eventId: crypto.randomUUID(),
    type,
    version,
    occurredAt: new Date().toISOString(),
    correlationId,
    data,
});
