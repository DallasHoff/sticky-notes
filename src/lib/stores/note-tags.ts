import { writable, type Readable, get } from 'svelte/store';
import type { Note, NotesStore } from './notes';
import { db } from '$lib/db/client';
import type { Tag, NewTag, TagsStore } from './tags';

export class NoteTagsStore implements Readable<Tag[]> {
	private noteTags = writable<Tag[]>([]);

	constructor(private noteId: Note['id'], private notes: NotesStore, private tags: TagsStore) {
		this.refreshTags();
	}

	subscribe = this.noteTags.subscribe;

	refreshTags = async () => {
		const tagsData = await db
			.selectFrom('noteTag')
			.where('noteTag.noteId', '=', this.noteId)
			.innerJoin('tag', 'noteTag.tagId', 'tag.id')
			.select(['tag.id', 'tag.label'])
			.orderBy('addedAt asc')
			.execute();

		this.noteTags.set(tagsData);

		return tagsData;
	};

	add = async (newTag: NewTag) => {
		const noteId = this.noteId;
		const existingTag = await db
			.selectFrom('tag')
			.select('id')
			.where('label', '=', newTag.label)
			.executeTakeFirst();

		if (existingTag) {
			const tagId = existingTag.id;
			await db.insertInto('noteTag').values({ tagId, noteId }).execute();
		} else {
			await db.transaction().execute(async (trx) => {
				const { id: tagId } = await trx
					.insertInto('tag')
					.values(newTag)
					.returning('id')
					.executeTakeFirstOrThrow();
				return await trx.insertInto('noteTag').values({ tagId, noteId }).executeTakeFirstOrThrow();
			});
		}

		this.refreshTags();
		this.notes.refreshNotes();
		this.tags.refreshTags();
	};

	remove = async (tagId: Tag['id']) => {
		const noteId = this.noteId;

		await db.transaction().execute(async (trx) => {
			await trx
				.deleteFrom('noteTag')
				.where('noteId', '=', noteId)
				.where('tagId', '=', tagId)
				.executeTakeFirstOrThrow();
			const remainingTagUsage = await trx
				.selectFrom('noteTag')
				.where('tagId', '=', tagId)
				.select('tagId')
				.executeTakeFirst();

			if (!remainingTagUsage) {
				await trx.deleteFrom('tag').where('id', '=', tagId).executeTakeFirstOrThrow();
			}
		});

		this.refreshTags();
		this.notes.refreshNotes();
		this.tags.refreshTags();
	};

	search = async (searchString: string): Promise<string[]> => {
		if (!searchString) {
			return [];
		}

		const currentTags = get(this.noteTags).map((tag) => tag.label);
		const results = await db
			.selectFrom('tag')
			.select('label')
			.where('label', 'like', `%${searchString}%`)
			.where('label', 'not in', [...currentTags, searchString])
			.limit(10)
			.execute();

		return results.map((result) => result.label);
	};
}
