import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EnvConfigService } from "../env/env-config.service";
import { ProductionQueueItem } from "@/modules/production/infrastructure/database/production-queue-item.entity";

export const databaseConfig = (
  envConfigService: EnvConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = process.env.NODE_ENV || envConfigService.get("NODE_ENV");

  if (nodeEnv === "test") {
    return {
      type: "sqlite",
      database: ":memory:",
      entities: [ProductionQueueItem],
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
    entities: [ProductionQueueItem],
    migrations: ["dist/migrations/*.js"],
    migrationsRun: true,
    synchronize: false,
    logging: envConfigService.get("NODE_ENV") !== "production",
  };
};
