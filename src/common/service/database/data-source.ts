import { DataSource } from "typeorm";
import { config } from "dotenv";
import { Client } from "pg";
import { ProductionQueueItem } from "../../../modules/production/infrastructure/database/production-queue-item.entity";

config();

const DEFAULT_SCHEMA = "production";

export async function ensureSchemaExists(): Promise<void> {
  const schemaName = process.env.DB_SCHEMA || DEFAULT_SCHEMA;

  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "postgres",
  });

  try {
    await client.connect();
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  } catch (error) {
    console.error("Erro ao criar schema:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "postgres",
  schema: process.env.DB_SCHEMA || DEFAULT_SCHEMA,
  entities: [ProductionQueueItem],
  migrations:
    process.env.NODE_ENV === "production"
      ? ["dist/src/migrations/*.js"]
      : ["src/migrations/*.ts"],
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
});
