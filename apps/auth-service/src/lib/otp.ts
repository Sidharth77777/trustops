import {
    generateSecret,
    verify,
    generateURI,
    generate
} from "otplib"

import QRCode from "qrcode"

import { APP_NAME } from "@trustops/shared"


export const twoFAHelper = (
    email: string
): { secret: string; otpAuthUri: string } => {

    const secret = generateSecret()

    const otpAuthUri = generateURI({
        issuer: APP_NAME,
        label: email,
        secret
    })

    console.log("NEW 2FA SECRET:", secret)
    console.log("OTP URI:", otpAuthUri)

    return {
        secret,
        otpAuthUri
    }
}


export const twoFAVerifier = async (
    code: string,
    twoFactorSecret: string
): Promise<boolean> => {

    const serverGeneratedCode = await generate({
        secret: twoFactorSecret
    })

    console.log("DATABASE SECRET:", twoFactorSecret)
    console.log("CODE FROM AUTH APP:", code)
    console.log("SERVER GENERATED CODE:", serverGeneratedCode)

    const result = await verify({
        secret: twoFactorSecret,
        token: code
    })

    console.log("VERIFY RESULT:", result)

    return result.valid
}


export const generateQRCode = async (
    data: string
): Promise<string> => {

    return QRCode.toDataURL(data)
}