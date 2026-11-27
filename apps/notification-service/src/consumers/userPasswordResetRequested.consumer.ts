import {
    logger,
    addBullMqJob
} from "@trustops/shared";

import {
    SEND_PASSWORD_RESET_EMAIL_JOB,
    UserPasswordResetRequestedEvent,
} from "@trustops/events";

import { passwordResetEmailQueue } from "../config/queues";

export const handlePasswordResetRequestEmailEvent = async ({ message }: any) => {

    if (!message.value) {
        return;
    }

    try {

        const event =
            JSON.parse(
                message.value.toString()
            ) as UserPasswordResetRequestedEvent;

        logger.info(
            { event },
            "USER PASSWORD RESET REQUEST EVENT RECEIVED"
        );

        await addBullMqJob(
            passwordResetEmailQueue,
            SEND_PASSWORD_RESET_EMAIL_JOB,
            {
                to: event.data.email,
                name: event.data.name,
                resetPasswordUrl: event.data.resetPasswordUrl,
                correlationId: event.correlationId,
            }
        );

        logger.info(
            {
                userId: event.data.userId,
                email: event.data.email,
                eventType: event.type,
            },
            "Password Reset email job queued"
        );

    } catch (error) {

        logger.error(
            { err: error },
            "Failed to process password reset email event"
        );

    }
};

