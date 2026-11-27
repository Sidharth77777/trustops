import { startVerificationEmailWorker } from "./verification-email.worker"
import { startResetPasswordEmailWorker } from "./reset-password.worker"

export const startWorkers = async() => {
    // add all workers here
    startVerificationEmailWorker()
    startResetPasswordEmailWorker()
    
}