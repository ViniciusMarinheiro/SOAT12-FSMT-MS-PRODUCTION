"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSchema1767699000000 = void 0;
class CreateSchema1767699000000 {
    name = "CreateSchema1767699000000";
    async up(queryRunner) {
        const schemaName = process.env.DB_SCHEMA || "production";
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
        await queryRunner.query(`SET search_path TO "${schemaName}", public`);
    }
    async down(queryRunner) {
        const schemaName = process.env.DB_SCHEMA || "production";
        await queryRunner.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
    }
}
exports.CreateSchema1767699000000 = CreateSchema1767699000000;
//# sourceMappingURL=1767699000000-create-schema.js.map