import type { ColumnType, Generated } from 'kysely';
import type { NoteColor } from './enums/note-color';

export type Schema = {
	note: NoteTable;
	tag: TagTable;
	noteTag: NoteTagTable;
};

export type Id = number;
export type Timestamp = number;
export type Bool = 0 | 1;

type NoteTable = {
	id: Generated<Id>;
	content: string;
	color: keyof typeof NoteColor;
	updatedAt: ColumnType<Timestamp, never, never>;
	createdAt: ColumnType<Timestamp, never, never>;
};

type TagTable = {
	id: Generated<Id>;
	label: string;
};

type NoteTagTable = {
	noteId: Id;
	tagId: Id;
	addedAt: ColumnType<Timestamp, never, never>;
};
