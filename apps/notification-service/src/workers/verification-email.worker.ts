import {Worker} from "bullmq"
import { BULLMQ_QUEUES, SEND_VERIFICATION_EMAIL_JOB, SendVerificationEmailJobData } from "@trustops/events"
import { createQueueRedisConnection, logger } from "@trustops/shared"
import { sendEmail } from "../services/email.service"
import { verificationEmailTemplate } from "../templates/verificationEmail";

const SUBJECT = "Verify your TrustOps account";
const TEXT = "Hello.. This email is for your email verification"
const LOGGER_MSG = "Verification email sent"

export const startVerificationEmailWorker = (): Worker<SendVerificationEmailJobData> => {
    const worker = new Worker<SendVerificationEmailJobData>(
        BULLMQ_QUEUES.VERIFICATION_EMAIL_QUEUE,
        async (job) => {
            if (job.name !== SEND_VERIFICATION_EMAIL_JOB) {
                logger.warn({jobName:job.name}, "Unknown email job")
                return
            }

            const {to, name, verificationUrl, correlationId} = job.data
            logger.info({
                jobId: job.id,
                correlationId,
                to,
                name,
                verificationUrl
            }, "Processing verification email job")

            const html = verificationEmailTemplate({name, verificationUrl})

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
            }, "Verification email job processed")
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