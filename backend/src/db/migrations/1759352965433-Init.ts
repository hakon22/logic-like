import { MigrationInterface, QueryRunner } from 'typeorm';

import { ideas } from 'assets/ideas';

const values = ideas.map(({ title, description }) => `('${title}', '${description}')`).join(', ').trim();

export class Init1759352965433 implements MigrationInterface {
  public name = 'Init1759352965433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "idea"."idea" (
        "id" SERIAL NOT NULL,
        "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "deleted" TIMESTAMP WITH TIME ZONE,
        "title" CHARACTER VARYING NOT NULL,
        "description" TEXT NOT NULL,
        PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "idea"."vote" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "deleted" TIMESTAMP WITH TIME ZONE,
        "ip_address" INET NOT NULL,
        "idea_id" INTEGER NOT NULL,
        PRIMARY KEY ("id"),
      CONSTRAINT "vote__idea_id" FOREIGN KEY ("idea_id")
        REFERENCES "idea"."idea"("id")
        ON UPDATE CASCADE
        ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "idea"."check_vote_limit"()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (SELECT COUNT("id") FROM "idea"."vote" WHERE "ip_address" = NEW."ip_address") >= 10 THEN
          RAISE EXCEPTION 'IP address has reached vote limit (10 votes)';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`
      CREATE TRIGGER "enforce_vote_limit__insert"
        BEFORE INSERT ON "idea"."vote"
        FOR EACH ROW EXECUTE FUNCTION "idea"."check_vote_limit"()
    `);

    await queryRunner.query(`
      CREATE TRIGGER "enforce_vote_limit__update"
        BEFORE UPDATE ON "idea"."vote"
        FOR EACH ROW EXECUTE FUNCTION "idea"."check_vote_limit"()
    `);

    await queryRunner.query('CREATE UNIQUE INDEX "unique_vote__ip_address_idea_idx" ON "idea"."vote" ("ip_address", "idea_id") WHERE "deleted" IS NULL');
    await queryRunner.query('CREATE INDEX "vote__idea_idx" ON "idea"."vote" ("idea_id")');

    await queryRunner.query(`INSERT INTO "idea"."idea" ("title", "description") VALUES ${values}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "idea"."vote__idea_idx"');
    await queryRunner.query('DROP INDEX "idea"."unique_vote__ip_address_idea_idx"');

    await queryRunner.query('DROP TRIGGER "enforce_vote_limit__update" ON "idea"."vote"');
    await queryRunner.query('DROP TRIGGER "enforce_vote_limit__insert" ON "idea"."vote"');

    await queryRunner.query('DROP FUNCTION "idea"."check_vote_limit"()');

    await queryRunner.query('DROP TABLE "idea"."vote"');
    await queryRunner.query('DROP TABLE "idea"."idea"');
  }
}
