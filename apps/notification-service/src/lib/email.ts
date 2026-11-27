import { emailFrom, resend, smtpTransporter } from "../config/email"

export const sendWithResend = async(to:string, html:string, subject:string, text:string): Promise<void> => {
    const {error} = await resend.emails.send({
        from: emailFrom,
        to,
        subject,
        text,
        html,
    })
    if (error) throw new Error(error.message)

}

export const sendWithNodemailer = async(to:string, html:string, subject:string, text:string): Promise<void> => {
    await smtpTransporter.sendMail({
        from: emailFrom,
        to,
        subject,
        text,
        html,
    })
}
