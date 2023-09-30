import type { Migration } from 'kysely';
import { Migration20230830 } from './2023-08-30';
import { Migration20230930 } from './2023-09-30';

export const migrations: Record<string, Migration> = {
	'2023-08-30': Migration20230830,
	'2023-09-30': Migration20230930,
};
