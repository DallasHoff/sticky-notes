import { get, readonly, writable } from 'svelte/store';
import type { Note, NotesStore } from './notes';

type ExpandState = 'delete' | 'colors' | null;

export class NoteEditorStore {
	private _editing = writable<boolean>(false);
	private _draftContent = writable<string>('');
	private _expanded = writable<ExpandState>(null);

	readonly editing = readonly(this._editing);
	readonly draftContent = readonly(this._draftContent);
	readonly expanded = readonly(this._expanded);

	constructor(private noteId: Note['id'], private notes: NotesStore) {}

	startEditing = () => {
		const note = this.notes.get(this.noteId);
		this._draftContent.set(note?.content ?? '');
		this._editing.set(true);
	};

	draftChange = (event: CustomEvent<{ value: string }>) => {
		this._draftContent.set(event.detail.value);
	};

	save = () => {
		const content = get(this._draftContent);
		this.notes.update(this.noteId, { content });
		this._editing.set(false);
	};

	discard = () => {
		this._editing.set(false);
	};

	expand = (expanded: ExpandState) => {
		this._expanded.set(expanded);
	};
}
