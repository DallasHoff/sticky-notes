import { Kysely, Migrator } from 'kysely';
import { SQLocalKysely } from 'sqlocal/kysely';
import type { Schema } from './schema';

const sqlocal = new SQLocalKysely('sticky-notes.db');
const kysely = new Kysely<Schema>({ dialect: sqlocal.dialect });

await sqlocal.sql`PRAGMA foreign_keys = ON`;

const migrator = new Migrator({
	db: kysely,
	provider: {
		async getMigrations() {
			const { migrations } = await import('./migrations/');
			return migrations;
		},
	},
});

const migration = await migrator.migrateToLatest();

if (migration.error) {
	console.error(migration.error);
}

export const db = kysely;
