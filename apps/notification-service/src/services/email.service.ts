// import { logger } from "@trustops/shared";
// import {verificationEmailTemplate} from "./../templates/verificationEmail"
// import { sendWithNodemailer, sendWithResend } from "../lib/email";

// type VerificationEmailInput = {
//     to: string;
//     name: string;
//     verificationUrl: string;
//     correlationId: string;
// };


// export const sendVerificationEmail = async({
//     to, name, correlationId, verificationUrl
// }: VerificationEmailInput, subject:string, text:string, loggerMsg:string) => {
//     const html = verificationEmailTemplate({name, verificationUrl})

//     // try resend first.. if error happens use nodemailer
//     try {
//         await sendWithResend(to, html, subject, text)
//         logger.info(
//             {correlationId, to, provider: "resend",},
//             loggerMsg,
//         )

//         return

//     } catch (resendError) {
//         logger.warn(
//             {correlationId, to, provider: "resend",
//                 error: resendError instanceof Error ? resendError.message : String(resendError),
//             },
//             "Resend email delivery failed, using Nodemailer fallback",
//         );
//     }

//     try {
//         await sendWithNodemailer(to, html, subject, text)
//         logger.info(
//             {correlationId, to, provider: "nodemailer",},
//             "Verification email sent using fallback (nodemailer) provider",
//         )


//     } catch (nodemailerError) {
//         logger.error(
//             {correlationId, to, provider: "nodemailer",
//                 error: nodemailerError instanceof Error ? nodemailerError.message : String(nodemailerError),
//             },
//             "All email providers failed",
//         );

//         throw nodemailerError
//     }

// }

import { logger } from "@trustops/shared";

import { sendWithNodemailer, sendWithResend } from "./../lib/email";

export const sendEmail = async (
    to: string,
    html: string,
    subject: string,
    text: string,
    correlationId: string,
    loggerMsg: string,
) => {

    // Try Resend first
    try {

        await sendWithResend(
            to,
            html,
            subject,
            text
        );

        logger.info(
            {
                correlationId,
                to,
                provider: "resend",
            },
            loggerMsg,
        );

        return;

    } catch (resendError) {

        logger.warn(
            {
                correlationId,
                to,
                provider: "resend",
                error:
                    resendError instanceof Error
                        ? resendError.message
                        : String(resendError),
            },
            "Resend email delivery failed, using Nodemailer fallback",
        );
    }

    // Fallback to Nodemailer
    try {

        await sendWithNodemailer(
            to,
            html,
            subject,
            text
        );

        logger.info(
            {
                correlationId,
                to,
                provider: "nodemailer",
            },
            loggerMsg,
        );

    } catch (nodemailerError) {

        logger.error(
            {
                correlationId,
                to,
                provider: "nodemailer",
                error:
                    nodemailerError instanceof Error
                        ? nodemailerError.message
                        : String(nodemailerError),
            },
            "All email providers failed",
        );

        throw nodemailerError;
    }
};
