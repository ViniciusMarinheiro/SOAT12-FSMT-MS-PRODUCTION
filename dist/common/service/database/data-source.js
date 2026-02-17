"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const production_queue_item_entity_1 = require("../../../modules/production/infrastructure/database/production-queue-item.entity");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "postgres",
    schema: process.env.DB_SCHEMA || "production",
    entities: [production_queue_item_entity_1.ProductionQueueItem],
    migrations: process.env.NODE_ENV === "production"
        ? ["dist/migrations/*.js"]
        : ["src/migrations/*.ts"],
    synchronize: false,
    logging: process.env.NODE_ENV !== "production",
});
exports.default = exports.AppDataSource;
//# sourceMappingURL=data-source.js.map