import { Kysely } from 'kysely';
import { SQLocalKysely } from 'sqlocal/kysely';
import type { Schema } from './schema';
import { migrate } from './migrator';

const sqlocal = new SQLocalKysely('sticky-notes.db');
const kysely = new Kysely<Schema>({ dialect: sqlocal.dialect });

try {
	await migrate(kysely);
} catch (err) {
	console.error(err);
}

export const db = kysely;
export const { getDatabaseFile, overwriteDatabaseFile } = sqlocal;
