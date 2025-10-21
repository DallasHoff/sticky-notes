import { Kysely } from 'kysely';
import { SQLocalKysely } from 'sqlocal/kysely';
import type { Schema } from './schema';
import { migrate } from './migrator';
import { notes, tags } from '$lib/stores';

const sqlocal = new SQLocalKysely({
	databasePath: 'sticky-notes.db',
	onInit: (sql) => [sql`PRAGMA foreign_keys = ON`],
	onConnect: async (reason) => {
		if (reason === 'initial') return;
		await tags.refreshTags();
		await notes.refreshNotes();
	},
});

const kysely = new Kysely<Schema>({ dialect: sqlocal.dialect });

try {
	await migrate(kysely);
} catch (err) {
	console.error(err);
}

export const db = kysely;
export const { getDatabaseFile, overwriteDatabaseFile } = sqlocal;
