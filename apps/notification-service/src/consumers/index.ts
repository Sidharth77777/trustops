import { runKafkaConsumer, subscribeToKafkaTopic } from "@trustops/shared"
import { getKafkaConsumer } from "../config/kafka"

import { USER_PASSWORD_RESET_REQUESTED_EVENT, USER_REGISTERED_EVENT, USER_VERIFICATION_REQUESTED_EVENT } from "@trustops/events"
import { handleVerificationEmailEvent } from "./userRegistered.consumer"
import { handlePasswordResetRequestEmailEvent } from "./userPasswordResetRequested.consumer"

export const initialiseKafkaConsumers = async() => {
    // initialise consumer
    const consumer = getKafkaConsumer()

    // subscribe to all topics
    await subscribeToKafkaTopic( consumer, USER_REGISTERED_EVENT );
    await subscribeToKafkaTopic( consumer, USER_VERIFICATION_REQUESTED_EVENT );
    await subscribeToKafkaTopic( consumer, USER_PASSWORD_RESET_REQUESTED_EVENT );

    // add consumers here
    await runKafkaConsumer(consumer, async({topic, message}) => {
        switch (topic) {
            case USER_REGISTERED_EVENT:
            case USER_VERIFICATION_REQUESTED_EVENT:
                await handleVerificationEmailEvent({message})
                break
            
            case USER_PASSWORD_RESET_REQUESTED_EVENT:
                await handlePasswordResetRequestEmailEvent({message})
                break
            // add other consumers too

            default:
                break
        }
    })
}