import type { Kysely, Migration } from 'kysely';
import { sql } from 'kysely';

export const Migration20230830: Migration = {
	async up(db: Kysely<any>) {
		await db.schema
			.createTable('note')
			.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement().notNull())
			.addColumn('content', 'text', (col) => col.notNull())
			.addColumn('color', 'text', (col) => col.notNull())
			.addColumn('updatedAt', 'integer', (col) => col.defaultTo(sql`(unixepoch())`).notNull())
			.addColumn('createdAt', 'integer', (col) => col.defaultTo(sql`(unixepoch())`).notNull())
			.execute();

		await sql`
      CREATE TRIGGER noteUpdateUpdatedAtTrigger AFTER UPDATE ON note
      BEGIN
        UPDATE note SET updatedAt = (unixepoch()) WHERE id = new.id;
      END;
    `.execute(db);

		await db.schema
			.createTable('tag')
			.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement().notNull())
			.addColumn('label', 'text', (col) => col.notNull())
			.execute();

		await db.schema
			.createTable('noteTag')
			.addColumn('noteId', 'integer', (col) =>
				col.references('note.id').onDelete('cascade').notNull()
			)
			.addColumn('tagId', 'integer', (col) =>
				col.references('tag.id').onDelete('cascade').notNull()
			)
			.addColumn('addedAt', 'integer', (col) => col.defaultTo(sql`(unixepoch())`).notNull())
			.addPrimaryKeyConstraint('noteTagPrimaryKey', ['noteId', 'tagId'])
			.execute();
	},
	async down(db: Kysely<any>) {
		await db.schema.dropTable('note').execute();
		await sql`DROP TRIGGER noteUpdateUpdatedAtTrigger`.execute(db);
		await db.schema.dropTable('tag').execute();
		await db.schema.dropTable('noteTag').execute();
	},
};
