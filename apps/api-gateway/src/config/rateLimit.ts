import rateLimit, { MINUTE } from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 15 * MINUTE,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
})