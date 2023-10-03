<script lang="ts">
	import { NoteColor } from '$lib/db/enums/note-color';
	import type { Note } from '$lib/stores/notes';
	import { notes, tags, themeUpperCase } from '$lib/stores';
	import NoteColorPicker from './note-color-picker.svelte';
	import NoteTimestamp from './note-timestamp.svelte';
	import NoteContent from './note-content.svelte';
	import NoteDeleteButton from './note-delete-button.svelte';
	import NoteEditButton from './note-edit-button.svelte';
	import NoteDiscardButton from './note-discard-button.svelte';
	import NoteTags from './note-tags.svelte';
	import { NoteTagsStore } from '$lib/stores/note-tags';
	import NoteTagButton from './note-tag-button.svelte';
	import { tick } from 'svelte';
	import NoteSaveButton from './note-save-button.svelte';
	import { NoteEditorStore } from '$lib/stores/note-editor';

	export let note: Note;

	const noteTags = new NoteTagsStore(note.id, notes, tags);
	const noteEditorStore = new NoteEditorStore(note.id, notes);
	const { editing } = noteEditorStore;

	let tagsComponent: NoteTags | undefined;
	let showTags: boolean = false;

	async function focusTags() {
		showTags = !showTags;
		await tick();
		tagsComponent?.focusTextbox();
	}
</script>

<article class="note-card" style:--note-color={NoteColor[note.color][$themeUpperCase]}>
	<header class="note-card__header" hidden={$editing}>
		<div class="note-card__header-buttons">
			<NoteDeleteButton {note} {noteEditorStore} />
			<div class="note-card__spacer" />
			<NoteColorPicker {note} {noteEditorStore} />
			<NoteTagButton on:click={focusTags} />
		</div>
		<div hidden={!showTags && $noteTags.length === 0}>
			<NoteTags {note} {noteTags} bind:this={tagsComponent} />
		</div>
	</header>
	<div
		role="application"
		class="note-card__body"
		class:note-card__body--editing={$editing}
		on:dblclick={noteEditorStore.startEditing}
	>
		<NoteContent {note} {noteEditorStore} />
	</div>
	<footer class="note-card__footer">
		{#if !$editing}
			<NoteEditButton on:click={noteEditorStore.startEditing} />
		{:else}
			<NoteSaveButton on:click={noteEditorStore.save} />
			<NoteDiscardButton on:click={noteEditorStore.discard} />
		{/if}
		<div class="note-card__spacer" />
		<NoteTimestamp {note} />
	</footer>
</article>

<style lang="scss">
	.note-card {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		color: black;
		background-color: var(--note-color);
		border-radius: 0;
		box-shadow: var(--card-shadow);

		&__header,
		&__footer {
			margin: 0;
			border: none;
			background-color: transparent;
		}

		&__header {
			padding: 0;
		}

		&__header-buttons {
			display: flex;
			align-items: center;
			gap: 1rem;
			min-height: 2.75rem;
			padding: 0.5rem 1rem;
			background-color: hsl(0 0% 0% / 0.05);
		}

		&__body {
			flex-grow: 1;
			overflow: auto;

			&--editing {
				overflow: hidden;
			}
		}

		&__footer {
			display: flex;
			align-items: center;
			gap: 1rem;
			padding: 0.5rem 1rem;
			border-top: 1px solid hsl(0 0% 0% / 0.15);
		}

		&__spacer {
			flex-grow: 1;
		}
	}
</style>
