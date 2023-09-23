import type { NoteColor } from '$lib/db/enums/note-color';
import { writable } from 'svelte/store';

export class SettingsStore {
	open = writable<boolean>(false);

	noteScale = writable<number>(localStorage.noteScale ? parseFloat(localStorage.noteScale) : 1);
	defaultNoteColor = writable<keyof typeof NoteColor>(localStorage.defaultNoteColor ?? 'YELLOW');

	constructor() {
		this.noteScale.subscribe((value) => (localStorage.noteScale = value.toString()));
		this.defaultNoteColor.subscribe((value) => (localStorage.defaultNoteColor = value));
	}
}
