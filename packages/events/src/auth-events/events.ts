import { KafkaEventEnvelope } from "../common/event";

export const USER_REGISTERED_EVENT = "user.registered" as const
export const USER_VERIFICATION_REQUESTED_EVENT = "user.verification-requested" as const;
export const USER_PASSWORD_RESET_REQUESTED_EVENT = "user.password-reset-requested" as const

export type UserRegisteredData = {
    userId: string;
    email: string;
    name: string;
    verificationUrl: string;
}
export type UserPasswordResetRequestedData = {
    userId: string;
    email: string;
    name: string;
    resetPasswordUrl: string;
}
export type UserVerificationRequestedData = UserRegisteredData

export type UserRegisteredEvent = KafkaEventEnvelope<typeof USER_REGISTERED_EVENT, UserRegisteredData>
export type UserVerificationRequestedEvent = KafkaEventEnvelope<typeof USER_VERIFICATION_REQUESTED_EVENT, UserVerificationRequestedData>
export type UserPasswordResetRequestedEvent = KafkaEventEnvelope<typeof USER_PASSWORD_RESET_REQUESTED_EVENT, UserPasswordResetRequestedData>

export type KafkaEventMap = {
    [USER_REGISTERED_EVENT]: UserRegisteredData;
    [USER_VERIFICATION_REQUESTED_EVENT]: UserVerificationRequestedData;
    [USER_PASSWORD_RESET_REQUESTED_EVENT]: UserPasswordResetRequestedData;
    
};