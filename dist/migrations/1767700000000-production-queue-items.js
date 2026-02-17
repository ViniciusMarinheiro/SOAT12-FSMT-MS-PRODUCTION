"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionQueueItems1767700000000 = void 0;
class ProductionQueueItems1767700000000 {
    name = "ProductionQueueItems1767700000000";
    async up(queryRunner) {
        const schema = process.env.DB_SCHEMA || "production";
        await queryRunner.query(`CREATE TYPE "${schema}"."production_queue_status_enum" AS ENUM (
        'QUEUED',
        'IN_DIAGNOSIS',
        'IN_REPAIR',
        'COMPLETED'
      )`);
        await queryRunner.query(`CREATE TABLE "${schema}"."production_queue_items" (
        "id" SERIAL NOT NULL,
        "work_order_id" integer NOT NULL,
        "customer_id" integer,
        "vehicle_id" integer,
        "protocol" character varying,
        "total_amount" numeric(12,2),
        "status" "${schema}"."production_queue_status_enum" NOT NULL DEFAULT 'QUEUED',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "started_at" TIMESTAMP WITH TIME ZONE,
        "completed_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "UQ_production_queue_items_work_order_id" UNIQUE ("work_order_id"),
        CONSTRAINT "PK_production_queue_items" PRIMARY KEY ("id")
      )`);
    }
    async down(queryRunner) {
        const schema = process.env.DB_SCHEMA || "production";
        await queryRunner.query(`DROP TABLE IF EXISTS "${schema}"."production_queue_items"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "${schema}"."production_queue_status_enum"`);
    }
}
exports.ProductionQueueItems1767700000000 = ProductionQueueItems1767700000000;
//# sourceMappingURL=1767700000000-production-queue-items.js.map