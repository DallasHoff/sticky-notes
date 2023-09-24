import { notes, tags } from '$lib/stores';
import { db, overwriteDatabaseFile } from './client';
import { migrate } from './migrator';

export async function importDb(dbFile: File): Promise<boolean> {
	try {
		await overwriteDatabaseFile(dbFile);
		await migrate(db);
		await tags.refreshTags();
		await notes.refreshNotes();
	} catch (err) {
		return false;
	}

	return true;
}
