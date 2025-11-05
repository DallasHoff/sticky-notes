import NoteCard from '$lib/components/notes/note-card.svelte';
import { writable, type Readable } from 'svelte/store';
import type { Note } from './notes';
import { notes } from '.';

export class PipNoteStore implements Readable<Note | null> {
	private activeNote = writable<Note | null>(null);

	subscribe = this.activeNote.subscribe;

	async openPipNoteCard(note: Note) {
		// Create picture-in-picture window
		// @ts-expect-error documentPictureInPicture is experimental
		const pipWindow = await window.documentPictureInPicture.requestWindow({
			width: 355,
			height: 385,
		});
		this.copyAllStylesheets(pipWindow);

		// Update the note when it is edited in the main window
		const unsubscribe = notes.subscribe((updatedNotes) => {
			const updatedNote = updatedNotes.find((n) => n.id === note.id);
			if (!updatedNote) return;
			this.mountNote(pipWindow, updatedNote);
		});

		// Handle clearing active note when the picture-in-picture window closes
		pipWindow.addEventListener(
			'pagehide',
			() => {
				unsubscribe();
				this.activeNote.set(null);
			},
			{ once: true }
		);
	}

	private mountNote(pipWindow: Window, note: Note) {
		// Create a wrapper element
		const target = document.createElement('div');
		target.id = 'picture-in-picture';

		// Mount the note card component
		new NoteCard({ target, props: { note, isReadonly: true } });

		// Put it into the window
		pipWindow.document.body.replaceChildren(target);

		// Update the active note
		this.activeNote.set(note);
	}

	private copyAllStylesheets(pipWindow: Window) {
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
	}
}
