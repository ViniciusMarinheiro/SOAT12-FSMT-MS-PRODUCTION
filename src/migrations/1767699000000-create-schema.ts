import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchema1767699000000 implements MigrationInterface {
  name = "CreateSchema1767699000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schemaName = process.env.DB_SCHEMA || "production";

    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await queryRunner.query(`SET search_path TO "${schemaName}", public`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schemaName = process.env.DB_SCHEMA || "production";
    await queryRunner.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
  }
}
