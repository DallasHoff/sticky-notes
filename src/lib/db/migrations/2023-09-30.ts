import type { Kysely, Migration } from 'kysely';
import { sql } from 'kysely';

export const Migration20230930: Migration = {
	async up(db: Kysely<any>) {
		await db
			.deleteFrom('tag')
			.where('id', 'not in', ({ selectFrom }: any) => selectFrom('noteTag').select('tagId'))
			.execute();

		await sql`
      CREATE TRIGGER noteTagDeleteUnusedTagTrigger AFTER DELETE ON noteTag
      BEGIN
        DELETE FROM tag WHERE id = old.tagId AND (SELECT COUNT(*) FROM noteTag WHERE tagId = old.tagId) = 0;
      END;
    `.execute(db);
	},
	async down(db: Kysely<any>) {
		await sql`DROP TRIGGER noteTagDeleteUnusedTagTrigger`.execute(db);
	},
};
