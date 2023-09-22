import { db } from '$lib/db/client';
import type { Bool, Schema } from '$lib/db/schema';
import type { Selectable, Insertable, Updateable } from 'kysely';
import { get, writable, type Readable, derived } from 'svelte/store';

export type Tag = Selectable<Schema['tag']>;
export type NewTag = Insertable<Schema['tag']>;
export type TagUpdate = Updateable<Schema['tag']>;
export type TagFilter = Tag & { matchedNotes: number; selected: Bool };

export class TagsStore implements Readable<TagFilter[]> {
	private tags = writable<TagFilter[]>([]);
	private selected = writable<Set<Tag['id']>>(new Set());

	readonly selectedTags = derived(this.selected, ($selected) => Array.from($selected));

	constructor() {
		this.initSelections();
		this.refreshTags();
	}

	private initSelections = () => {
		if (!localStorage.noteTagsSelected) return;

		let storedSelections: unknown;

		try {
			storedSelections = JSON.parse(localStorage.noteTagsSelected);
		} catch (err) {
			localStorage.removeItem('noteTagsSelected');
			return;
		}

		const selectionsAsArray = storedSelections;
		if (!Array.isArray(selectionsAsArray)) return;

		const seletionsAsInts = selectionsAsArray
			.map((tagId) => parseInt(tagId))
			.filter((tagId) => !isNaN(tagId));

		this.selected.update((selected) => {
			seletionsAsInts.forEach((tagId) => selected.add(tagId));
			return selected;
		});
	};

	subscribe = this.tags.subscribe;

	refreshTags = async () => {
		const selectedTags = get(this.selectedTags);
		const tagsData = await db
			.selectFrom('noteTag')
			.innerJoin('tag', 'tag.id', 'noteTag.tagId')
			.where(({ eb, selectFrom }) => {
				if (selectedTags.length === 0) {
					return eb.val(true);
				}
				return eb(
					'noteId',
					'in',
					selectFrom('noteTag')
						.select('noteId')
						.where('tagId', 'in', selectedTags)
						.groupBy('noteId')
						.having(({ fn }) => fn.count('noteId'), '=', selectedTags.length)
				);
			})
			.select(({ eb }) => [
				'tag.id',
				'tag.label',
				eb.fn.count<number>('noteId').as('matchedNotes'),
				eb
					.case()
					.when('tagId', 'in', selectedTags)
					.then<Bool>(1)
					.else<Bool>(0)
					.end()
					.as('selected'),
			])
			.groupBy('tagId')
			.orderBy('selected desc')
			.orderBy('matchedNotes desc')
			.execute();

		this.tags.set(tagsData);

		let shouldRefresh = false;

		this.selected.update((selected) => {
			const tagIds = tagsData.map((tag) => tag.id);

			selected.forEach((tagId) => {
				if (!tagIds.includes(tagId)) {
					selected.delete(tagId);
					shouldRefresh = true;
				}
			});

			return selected;
		});

		if (shouldRefresh) {
			await this.refreshTags();
		}

		return tagsData;
	};

	toggleSelection = (tagId: Tag['id']) => {
		this.selected.update((selected) => {
			const method = selected.has(tagId) ? 'delete' : 'add';
			selected[method](tagId);

			const selectionsAsString = JSON.stringify(Array.from(selected));
			localStorage.noteTagsSelected = selectionsAsString;

			return selected;
		});

		this.refreshTags();
	};
}
