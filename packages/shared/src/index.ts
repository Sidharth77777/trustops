// API RESPONSE TYPES AND FUNCTIONS
export {sendSuccessResponse, sendFailResponse} from "./responses/response"
export type {SuccessResponse, ErrorResponse} from "./responses/types"

// LOGGER
export {logger} from "./logger/logger"

// ERRORS AND STATUSCODES
export {AppError} from "./errors/AppError"
export {ErrorCodes} from "./errors/errorCodes"

// HEADERS
export {HEADERS, APP_URL_PREFIX, APP_NAME, CACHE_TTL_SECONDS} from "./config/constants"

// PG HELPERS
export {getPool, checkPoolHealth, closePool} from "./db/pool"
export {withTransaction} from "./db/transaction"

// REDIS HELPERS
export {startRedis, getRedisClient, endRedis} from "./redis/client"
export {getRedisVal, setRedisVal, setRedisExpVal, getRedisJson, setRedisJson, setRedisExpJson, deleteRedisVal, existsRedisVal} from "./redis/redis"

// KAFKA HELPERS
export {createKafkaClient} from "./kafka/client"
export {createKafkaConsumer, subscribeToKafkaTopic, runKafkaConsumer} from "./kafka/consumer"
export {createKafkaProducer, publishKafkaEvent} from "./kafka/producer"
export {kafkaProducers} from "./kafka/producers"
export {kafkaConsumers} from "./kafka/consumers"
export {ensureKafkaTopics} from "./kafka/topics"
export {createKafkaAdmin} from "./kafka/admin"

// BULLMQ HELPERS
export {createQueueRedisConnection} from "./queue/client"
export {addBullMqJob} from "./queue/job"
export {createBullMqQueue} from "./queue/queue"
export {createBullMqQueueWorker} from "./queue/worker"

// OUTBOX HELPERS
export {OutboxEvent} from "./outbox/types"
export {createOutboxEvent, getPendingOutboxEvents, markOutboxEventFailed, markOutboxEventPublished, retryOutboxEvent, deleteOutboxEvent} from "./outbox/repository"

// MIDDLEWARES
export {asyncHandler} from "./async/asyncHandler"           // ASYNCHRONOUS TRY & CATCH MIDDLEWARE
export {notFound} from "./notFound/notFoundMiddleware"      // ROUTE NOT FOUND MIDDLEWARE
export {errorHandler} from "./errors/errorHandler"          // GLOBAL ERROR HANDLER
export {validateBody} from "./validation/validateBody"      // ZOD VALIDATION MIDDLEWARE

// REQUEST CONTEXT
export type {RequestContext} from "./context/types"
export {runWithRequestContext, getRequestContext, checkContext} from "./context/requestContext"
export {requestIdMiddleware} from "./context/requestIdMiddleware"

// JWT & AUTH HELPERS
export {signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken, signBothJWTTokens} from "./auth/jwt"
export type {JWTPayload, UserRole, RefreshTokenPayload} from "./auth/types"
export {authenticate} from "./auth/authenticate"

// PAGINATION TYPES
export type {PaginationParams, PaginationMeta, PaginatedResponse} from "./pagination/pagination"