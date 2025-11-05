import NoteCard from '$lib/components/notes/note-card.svelte';
import { writable, type Readable } from 'svelte/store';
import type { Note } from './notes';

export class PipNoteStore implements Readable<Note | null> {
	private activeNote = writable<Note | null>(null);

	subscribe = this.activeNote.subscribe;

	async openPipNoteCard(note: Note) {
		// Create an element and mount a note component into it
		const target = document.createElement('div');
		target.id = 'picture-in-picture';

		new NoteCard({ target, props: { note, isReadonly: true } });

		// Create picture-in-picture window
		// @ts-expect-error documentPictureInPicture is experimental
		const pipWindow = await window.documentPictureInPicture.requestWindow({
			width: 355,
			height: 385,
		});

		// Handle clearing active note when the picture-in-picture window closes
		pipWindow.addEventListener('pagehide', () => this.activeNote.set(null), { once: true });

		// Update the active note
		this.activeNote.set(note);

		// Copy all stylesheets
		[...document.styleSheets].forEach((styleSheet) => {
			try {
				const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
				const style = document.createElement('style');

				style.textContent = cssRules;
				pipWindow.document.head.appendChild(style);
			} catch (e) {
				const link = document.createElement('link');

				link.rel = 'stylesheet';
				link.type = styleSheet.type;
				link.media = styleSheet.media.toString();
				link.href = styleSheet.href ?? '';
				pipWindow.document.head.appendChild(link);
			}
		});

		// Add the element to the picture-in-picture window
		pipWindow.document.body.append(target);
	}
}
