import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatChatMembers1750951895436 implements MigrationInterface {
  name = 'ChatChatMembers1750951895436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat" ("id" SERIAL NOT NULL, "isGroup" boolean NOT NULL DEFAULT false, "isPrivate" boolean NOT NULL DEFAULT true, "name" text, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_member" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "chat_id" integer NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "is_banned" boolean NOT NULL DEFAULT false, "is_muted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2aad8c13481bba9b43eaa2a774f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_member" ADD CONSTRAINT "FK_aef9e306e4d06004b15d49b5c0b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_member" ADD CONSTRAINT "FK_96b306402ea3610e4bfe6177c1a" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_member" DROP CONSTRAINT "FK_96b306402ea3610e4bfe6177c1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_member" DROP CONSTRAINT "FK_aef9e306e4d06004b15d49b5c0b"`,
    );
    await queryRunner.query(`DROP TABLE "chat_member"`);
    await queryRunner.query(`DROP TABLE "chat"`);
  }
}
