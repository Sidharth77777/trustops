import { AppError, ErrorCodes } from "@trustops/shared"

const checkEnvVariables = (key:string): string => {
    const val = process.env[key]
    if (!val) throw new AppError(500, `Missing ${key} in environment variables`, ErrorCodes.INTERNAL_SERVER_ERROR)
    return val
}

export const RESEND_ENV = {
    RESEND_API_KEY: checkEnvVariables("RESEND_API_KEY"),
    EMAIL_FROM: checkEnvVariables("EMAIL_FROM"),

}

export const NODEMAILER_ENV = {
    SMTP_HOST: checkEnvVariables("SMTP_HOST"),
    SMTP_PORT: Number(checkEnvVariables("SMTP_PORT")),
    SMTP_SECURE: checkEnvVariables("SMTP_SECURE") === "true",
    SMTP_USER: checkEnvVariables("SMTP_USER"),
    SMTP_PASSWORD: checkEnvVariables("SMTP_PASSWORD"),

}