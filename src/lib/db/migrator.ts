import { Kysely, Migrator } from 'kysely';
import { migrations } from './migrations/';
import type { Schema } from './schema';

export async function migrate(db: Kysely<Schema>) {
	const migrator = new Migrator({
		db,
		provider: {
			async getMigrations() {
				return migrations;
			},
		},
	});

	const migration = await migrator.migrateToLatest();

	if (migration.error) {
		console.error(migration.error);
		throw new Error('Migration failed');
	}
}
