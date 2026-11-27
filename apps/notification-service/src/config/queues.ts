import { createBullMqQueue } from "@trustops/shared";
import { BULLMQ_QUEUES, SendPasswordResetEmailJobData, SendVerificationEmailJobData } from "@trustops/events";

export const verificationEmailQueue = createBullMqQueue<SendVerificationEmailJobData>(
    BULLMQ_QUEUES.VERIFICATION_EMAIL_QUEUE
)

export const passwordResetEmailQueue = createBullMqQueue<SendPasswordResetEmailJobData>(
    BULLMQ_QUEUES.PASSWORD_RESET_EMAIL_QUEUE
)