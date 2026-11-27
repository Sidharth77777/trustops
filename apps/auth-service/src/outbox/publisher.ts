import {
    deleteOutboxEvent,
    getPendingOutboxEvents,
    markOutboxEventFailed,
    publishKafkaEvent,
    withTransaction,
    logger,
} from "@trustops/shared";

import { getKafkaProducer } from "../config/kafka";

export const publishOutboxEvents = async (): Promise<void> => {
    const producer = await getKafkaProducer();

    // Read pending events
    const events = await withTransaction(async (client) => {
        return getPendingOutboxEvents(client, 100);
    });

    if (events.length === 0) {
        return;
    }

    for (const event of events) {
        try {
            await publishKafkaEvent(
                producer,
                event.payload as any,
                event.aggregate_id ?? event.id
            );

            // Kafka accepted the event.
            // now safe to delete the outbox row.
            await withTransaction(async (client) => {
                await deleteOutboxEvent(client, event.id);
            });

            logger.info(
                `Outbox event published: ${event.event_type} (${event.id})`
            );

        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);

            await withTransaction(async (client) => {
                await markOutboxEventFailed(
                    client,
                    event.id,
                    errorMessage
                );
            });

            logger.error(
                {
                    eventId: event.id,
                    eventType: event.event_type,
                    error: errorMessage,
                },
                "Failed to publish outbox event"
            );
        }
    }
};

export const startOutboxPublisher = (): void => {
    setInterval(async () => {
        try {
            await publishOutboxEvents();
        } catch (error) {
            logger.error(
                { error },
                "Outbox publisher cycle failed"
            );
        }
    }, 5000);
};