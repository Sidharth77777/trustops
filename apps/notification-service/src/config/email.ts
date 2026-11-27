import {Resend} from "resend"
import nodemailer, {Transporter} from "nodemailer"
import { NODEMAILER_ENV, RESEND_ENV } from "./env"

export const resend = new Resend(RESEND_ENV.RESEND_API_KEY)

export const emailFrom = RESEND_ENV.EMAIL_FROM

export const smtpTransporter: Transporter = nodemailer.createTransport({
    host: NODEMAILER_ENV.SMTP_HOST,
    port: NODEMAILER_ENV.SMTP_PORT,
    secure: NODEMAILER_ENV.SMTP_SECURE,
    auth: {
        user: NODEMAILER_ENV.SMTP_USER,
        pass: NODEMAILER_ENV.SMTP_PASSWORD,
    },
    from: emailFrom,

}) 

