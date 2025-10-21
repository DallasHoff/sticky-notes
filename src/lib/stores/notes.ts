import { db } from '$lib/db/client';
import type { Schema } from '$lib/db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';
import { writable, type Readable, get, readonly } from 'svelte/store';
import type { TagsStore } from './tags';
import { settings } from '.';

export type Note = Selectable<Schema['note']>;
export type NewNote = Insertable<Schema['note']>;
export type NoteUpdate = Updateable<Schema['note']>;

export class NotesStore implements Readable<Note[]> {
	private notes = writable<Note[]>([]);
	private notesCount = writable<number | null>(null);

	private offset = 0;
	private limit = 1000;

	readonly count = readonly(this.notesCount);

	constructor(private tags: TagsStore) {
		setTimeout(() => {
			tags.selectedTags.subscribe(() => {
				this.refreshNotes();
			});
		}, 0);
	}

	subscribe = this.notes.subscribe;

	refreshNotes = async () => {
		const selectedTags = get(this.tags.selectedTags);

		const query =
			selectedTags.length === 0
				? db.selectFrom('note').selectAll().orderBy('createdAt', 'desc')
				: db
						.selectFrom('noteTag')
						.innerJoin('note', 'note.id', 'noteTag.noteId')
						.selectAll('note')
						.where('tagId', 'in', selectedTags)
						.groupBy('noteId')
						.having(({ fn }) => fn.count('noteId'), '=', selectedTags.length)
						.orderBy('createdAt', 'desc');

		const notesData = await query.offset(this.offset).limit(this.limit).execute();
		const { notesCount } = await db
			.selectFrom(() => query.as('results'))
			.select(({ fn }) => fn.countAll<number>().as('notesCount'))
			.executeTakeFirstOrThrow();

		this.notes.set(notesData);
		this.notesCount.set(notesCount);

		return notesData;
	};

	setPage = async (offset: number, limit: number) => {
		this.offset = offset;
		this.limit = limit;
		await this.refreshNotes();
	};

	get = (noteId: Note['id']) => {
		const notes = get(this.notes);
		return notes.find((note) => note.id === noteId);
	};

	add = async (newNote?: NewNote, scrollToTop?: boolean) => {
		if (!newNote) {
			newNote = {
				color: get(settings.defaultNoteColor),
				content: '',
			};
		}

		if (scrollToTop) {
			document.documentElement.scrollIntoView({ behavior: 'smooth' });
		}

		const createdNote = await db.transaction().execute(async (trx) => {
			if (!newNote) return;

			const createdNote = await trx
				.insertInto('note')
				.values(newNote)
				.returningAll()
				.executeTakeFirstOrThrow();

			const noteId = createdNote.id;
			const selectedTags = get(this.tags.selectedTags);

			if (selectedTags.length > 0) {
				for (let tagId of selectedTags) {
					await trx.insertInto('noteTag').values({ tagId, noteId }).executeTakeFirstOrThrow();
				}
			}

			return createdNote;
		});

		this.refreshNotes();
		this.tags.refreshTags();

		return createdNote;
	};

	update = async (noteId: Note['id'], noteUpdate: NoteUpdate) => {
		const [updatedNote] = await db
			.updateTable('note')
			.set(noteUpdate)
			.where('id', '=', noteId)
			.returningAll()
			.execute();

		this.refreshNotes();

		return updatedNote;
	};

	remove = async (noteId: Note['id']) => {
		const [deletedNote] = await db
			.deleteFrom('note')
			.where('id', '=', noteId)
			.returningAll()
			.execute();

		this.refreshNotes();
		this.tags.refreshTags();

		return deletedNote;
	};
}
