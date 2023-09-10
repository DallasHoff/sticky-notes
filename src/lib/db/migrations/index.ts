import type { Migration } from 'kysely';
import { Migration20230830 } from './2023-08-30';

export const migrations: Record<string, Migration> = {
	'2023-08-30': Migration20230830,
};
