export type VerificationEmailTemplateData = {
    name: string;
    verificationUrl: string;
};

export const verificationEmailTemplate = ({
    name,
    verificationUrl,
}: VerificationEmailTemplateData): string => {
    const year = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>Verify your TrustOps account</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
    color: #111827;
">

    <div style="
        width: 100%;
        padding: 40px 16px;
        box-sizing: border-box;
        background-color: #f4f6f8;
    ">

        <div style="
            width: 100%;
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
        ">

            <!-- Header -->
            <div style="
                padding: 28px 24px;
                text-align: center;
                border-bottom: 1px solid #f0f0f0;
            ">
                <div style="
                    font-size: 26px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    color: #111827;
                ">
                    TrustOps
                </div>
            </div>

            <!-- Content -->
            <div style="
                padding: 36px 32px;
            ">

                <h1 style="
                    margin: 0 0 16px;
                    text-align: center;
                    font-size: 24px;
                    line-height: 1.3;
                    color: #111827;
                ">
                    Verify your email
                </h1>

                <p style="
                    margin: 0 0 16px;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #4b5563;
                ">
                    Hi <strong>${name}</strong>,
                </p>

                <p style="
                    margin: 0 0 24px;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #4b5563;
                ">
                    Welcome to TrustOps. Please verify your email address
                    to complete your account setup.
                </p>

                <!-- CTA -->
                <div style="
                    text-align: center;
                    margin: 30px 0;
                ">
                    <a
                        href="${verificationUrl}"
                        style="
                            display: inline-block;
                            padding: 13px 26px;
                            background-color: #111827;
                            color: #ffffff;
                            text-decoration: none;
                            font-size: 15px;
                            font-weight: 600;
                            border-radius: 8px;
                        "
                    >
                        Verify Email Address
                    </a>
                </div>

                <p style="
                    margin: 0 0 10px;
                    font-size: 13px;
                    line-height: 1.5;
                    color: #6b7280;
                ">
                    If the button above doesn't work, copy and paste the
                    following link into your browser:
                </p>

                <p style="
                    margin: 0 0 24px;
                    padding: 12px;
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    font-size: 12px;
                    line-height: 1.5;
                    word-break: break-all;
                ">
                    <a
                        href="${verificationUrl}"
                        style="
                            color: #374151;
                            text-decoration: none;
                        "
                    >
                        ${verificationUrl}
                    </a>
                </p>

                <div style="
                    padding: 14px 16px;
                    background-color: #f9fafb;
                    border-left: 3px solid #111827;
                    border-radius: 4px;
                ">
                    <p style="
                        margin: 0;
                        font-size: 13px;
                        line-height: 1.5;
                        color: #6b7280;
                    ">
                        If you didn't create a TrustOps account, you can
                        safely ignore this email.
                    </p>
                </div>

            </div>

            <!-- Footer -->
            <div style="
                padding: 22px 24px;
                background-color: #f9fafb;
                border-top: 1px solid #e5e7eb;
                text-align: center;
            ">

                <p style="
                    margin: 0 0 8px;
                    font-size: 12px;
                    color: #9ca3af;
                ">
                    This is an automated message. Please do not reply.
                </p>

                <p style="
                    margin: 0;
                    font-size: 12px;
                    color: #9ca3af;
                ">
                    © ${year} TrustOps. All rights reserved.
                </p>

            </div>

        </div>

    </div>

</body>
</html>
`;
};