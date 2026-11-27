import {
    logger,
    addBullMqJob
} from "@trustops/shared";

import {
    SEND_VERIFICATION_EMAIL_JOB,
    UserRegisteredEvent,
    UserVerificationRequestedEvent,
} from "@trustops/events";

import { verificationEmailQueue } from "../config/queues";

export const handleVerificationEmailEvent = async ({ message }: any) => {

    if (!message.value) {
        return;
    }

    try {

        const event =
            JSON.parse(
                message.value.toString()
            ) as UserRegisteredEvent | UserVerificationRequestedEvent;

        logger.info(
            { event },
            "USER VERIFICATION EVENT RECEIVED"
        );

        await addBullMqJob(
            verificationEmailQueue,
            SEND_VERIFICATION_EMAIL_JOB,
            {
                to: event.data.email,
                name: event.data.name,
                verificationUrl: event.data.verificationUrl,
                correlationId: event.correlationId,
            }
        );

        logger.info(
            {
                userId: event.data.userId,
                email: event.data.email,
                eventType: event.type,
            },
            "Verification email job queued"
        );

    } catch (error) {

        logger.error(
            { err: error },
            "Failed to process verification email event"
        );

    }
};
