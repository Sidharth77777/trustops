import { PoolClient } from "pg";

import { OutboxEvent } from "./types";

export const createOutboxEvent = async (
    client: PoolClient,
    eventType: string,
    aggregateId: string | null,
    payload: unknown
): Promise<void> => {
    await client.query(
        `
        INSERT INTO outbox_events (event_type, aggregate_id,payload)
        VALUES ($1, $2, $3);
        `,
        [eventType, aggregateId, JSON.stringify(payload)]
    );
};

export const getPendingOutboxEvents = async (
    client: PoolClient,
    limit = 100
): Promise<OutboxEvent[]> => {
    const result = await client.query<OutboxEvent>(
        `
        SELECT id, event_type, aggregate_id, payload, status, attempts, last_error, created_at, published_at
        FROM outbox_events
        WHERE status = 'PENDING'
        ORDER BY created_at ASC
        LIMIT $1
        `, [limit]
    );

    return result.rows;
};

export const markOutboxEventPublished = async (
    client: PoolClient,
    eventId: string
): Promise<void> => {
    await client.query(
        `
        UPDATE outbox_events
        SET
            status = 'PUBLISHED',
            published_at = NOW(),
            last_error = NULL
        WHERE id = $1;
        `, [eventId]
    );
};

export const markOutboxEventFailed = async (
    client: PoolClient,
    eventId: string,
    error: string
): Promise<void> => {
    await client.query(
        `
        UPDATE outbox_events
        SET
            status = 'FAILED',
            attempts = attempts + 1,
            last_error = $2
        WHERE id = $1;
        `, [eventId, error]
    );
};

export const retryOutboxEvent = async (
    client: PoolClient,
    eventId: string
): Promise<void> => {
    await client.query(
        `
        UPDATE outbox_events
        SET
            status = 'PENDING',
            last_error = NULL
        WHERE id = $1;
        `, [eventId]
    );
};

export const deleteOutboxEvent = async (
    client: PoolClient,
    eventId: string
): Promise<void> => {
    await client.query(
        `
        DELETE FROM outbox_events
        WHERE id = $1;
        `,
        [eventId]
    );
};