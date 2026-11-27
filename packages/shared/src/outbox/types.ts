import { KafkaEventEnvelope } from "@trustops/events";

export type OutboxEvent = {
    id: string;
    event_type: string;
    aggregate_id: string | null;
    payload: KafkaEventEnvelope<string, unknown>;
    status: "PENDING" | "PUBLISHED" | "FAILED";
    attempts: number;
    last_error: string | null;
    created_at: Date;
    published_at: Date | null;
};