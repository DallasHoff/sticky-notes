import { get, writable } from 'svelte/store';
import type { Note, NotesStore } from './notes';

export class NoteEditorStore {
	editing = writable<boolean>(false);
	draftContent = writable<string>('');

	constructor(private noteId: Note['id'], private notes: NotesStore) {}

	startEditing = () => {
		const note = this.notes.get(this.noteId);
		this.draftContent.set(note?.content ?? '');
		this.editing.set(true);
	};

	draftChange = (event: CustomEvent<{ value: string }>) => {
		this.draftContent.set(event.detail.value);
	};

	save = () => {
		const content = get(this.draftContent);
		this.notes.update(this.noteId, { content });
		this.editing.set(false);
	};

	discard = () => {
		this.editing.set(false);
	};
}
