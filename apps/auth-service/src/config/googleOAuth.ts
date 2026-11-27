import {OAuth2Client} from "google-auth-library"
import { ENV } from "./env"
import { GOOGLE_OAUTH_REDIRECT_URI } from "../constants/constants"

export const googleOAuthClient = new OAuth2Client({
    client_id: ENV.GOOGLE_CLIENT_ID,
    client_secret: ENV.GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_OAUTH_REDIRECT_URI
})

export const generateGoogleOAuthRedirectUri = (): string => {
    return googleOAuthClient.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["openid", "email", "profile"]
    })
}