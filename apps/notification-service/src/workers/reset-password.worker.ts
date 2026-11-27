import {Worker} from "bullmq"
import { BULLMQ_QUEUES, SEND_PASSWORD_RESET_EMAIL_JOB, SendPasswordResetEmailJobData } from "@trustops/events"
import { createQueueRedisConnection, logger } from "@trustops/shared"
import { sendEmail } from "../services/email.service"
import { resetPasswordEmailTemplate } from "../templates/resetPasswordEmail";

const SUBJECT = "Reset your TrustOps account password";
const TEXT = "Hello.. This email is for resetting your account password"
const LOGGER_MSG = "Reset password email sent"

export const startResetPasswordEmailWorker = (): Worker<SendPasswordResetEmailJobData> => {
    const worker = new Worker<SendPasswordResetEmailJobData>(
        BULLMQ_QUEUES.PASSWORD_RESET_EMAIL_QUEUE,
        async (job) => {
            if (job.name !== SEND_PASSWORD_RESET_EMAIL_JOB) {
                logger.warn({jobName:job.name}, "Unknown email job")
                return
            }

            const {to, name, resetPasswordUrl, correlationId} = job.data
            logger.info({
                jobId: job.id,
                correlationId,
                to,
                name,
                resetPasswordUrl
            }, "Processing password reset email job")

            const html = resetPasswordEmailTemplate({name, resetPasswordUrl})

            // send email function
            await sendEmail(
                to,
                html,
                SUBJECT,
                TEXT,
                correlationId,
                LOGGER_MSG
            )

            // email sent

            logger.info({
                jobId:job.id,
                correlationId,
                to
            }, "Password reset email job processed")
        },
        {
            connection: createQueueRedisConnection(),
            concurrency: 5,
        }
    )

    worker.on("failed", (job, error) => {
        logger.error({
            jobId: job?.id,
            error: error.message,
        }, "Email job failed")
    })

    worker.on("error", (error) => {
        logger.error({error},"Email worker error");
    });

    return worker
}