
export const SEND_VERIFICATION_EMAIL_JOB = "send-email-verification" as const
export type SendVerificationEmailJobData = {
    to: string;
    name: string;
    verificationUrl: string;
    correlationId: string;
}


export const SEND_PASSWORD_RESET_EMAIL_JOB = "send-password-reset-email" as const
export type SendPasswordResetEmailJobData = {
    to: string;
    name: string;
    resetPasswordUrl: string;
    correlationId: string;
}

