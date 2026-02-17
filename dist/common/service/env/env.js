"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z
    .object({
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.string(),
    DB_USERNAME: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_DATABASE: zod_1.z.string(),
    DB_SCHEMA: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string(),
    PORT: zod_1.z.string().default("3334"),
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    DOCUMENTATION_PREFIX: zod_1.z.string(),
    REDIS_HOST: zod_1.z.string().optional().default("127.0.0.1"),
    REDIS_PORT: zod_1.z.coerce.number().optional().default(6379),
    REDIS_DB: zod_1.z.coerce.number().optional().default(0),
    REDIS_PASSWORD: zod_1.z.string().optional().default(""),
    RABBITMQ_URL: zod_1.z.string().optional(),
    RABBITMQ_CONSUMER_MAX_RETRIES: zod_1.z.coerce.number().optional().default(3),
    RABBITMQ_CONSUMER_RETRY_DELAY_MS: zod_1.z.coerce
        .number()
        .optional()
        .default(1000),
    DLQ_REPUBLISH_TO_MAIN: zod_1.z
        .string()
        .transform((val) => val.toLowerCase() === "true")
        .optional()
        .default(false),
    SERVER_URL: zod_1.z.string(),
    ORDER_SERVICE_URL: zod_1.z.string().optional(),
})
    .transform((env) => ({
    ...env,
    SERVER_URL_PREFIX: `${env.SERVER_URL.replace(/\/$/, "")}/${env.DOCUMENTATION_PREFIX.replace(/^\//, "")}`,
}));
//# sourceMappingURL=env.js.map