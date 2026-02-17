"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const production_queue_item_entity_1 = require("../../../modules/production/infrastructure/database/production-queue-item.entity");
const databaseConfig = (envConfigService) => {
    const nodeEnv = process.env.NODE_ENV || envConfigService.get("NODE_ENV");
    if (nodeEnv === "test") {
        return {
            type: "sqlite",
            database: ":memory:",
            entities: [production_queue_item_entity_1.ProductionQueueItem],
            synchronize: true,
            dropSchema: true,
            migrationsRun: false,
            logging: false,
        };
    }
    return {
        type: "postgres",
        host: envConfigService.get("DB_HOST"),
        port: parseInt(envConfigService.get("DB_PORT")),
        username: envConfigService.get("DB_USERNAME"),
        password: envConfigService.get("DB_PASSWORD"),
        database: envConfigService.get("DB_DATABASE"),
        schema: envConfigService.get("DB_SCHEMA"),
        entities: [production_queue_item_entity_1.ProductionQueueItem],
        migrations: ["dist/migrations/*.js"],
        migrationsRun: true,
        synchronize: false,
        logging: envConfigService.get("NODE_ENV") !== "production",
    };
};
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map