import { db, overwriteDatabaseFile } from './client';
import { migrate } from './migrator';

export async function importDb(dbFile: File): Promise<boolean> {
	try {
		await overwriteDatabaseFile(dbFile, async () => {
			await migrate(db);
		});
	} catch (err) {
		return false;
	}

	return true;
}
