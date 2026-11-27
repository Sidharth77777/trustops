import {
    generate,
    generateURI
} from "otplib"

import QRCode from "qrcode"

const secret = "VVXVZAEDZOSPG6LO5AMAUGYXYKIOQTHT"

async function main() {

    const uri = generateURI({
        secret,
        label: "test@gmail.com",
        issuer: "trustops",
        algorithm: "sha1",
        digits: 6,
        period: 30
    })

    await QRCode.toFile(
        "test-otp-qr.png",
        uri
    )

    console.log("\nSECRET:", secret)
    console.log("\nURI:", uri)
    console.log("\nQR CODE CREATED: test-otp-qr.png")
    console.log("Scan this QR using your Authenticator app.\n")

    setInterval(async () => {

        const now = Date.now()

        const token = await generate({
            secret,
            algorithm: "sha1",
            digits: 6,
            period: 30
        })

        const unixSeconds = Math.floor(now / 1000)

        const currentWindow = Math.floor(unixSeconds / 30)

        const secondsRemaining =
            30 - (unixSeconds % 30)

        console.log({
            serverTime: new Date(now).toISOString(),
            unixSeconds,
            currentWindow,
            secondsRemaining,
            token
        })

    }, 1000)
}

main()