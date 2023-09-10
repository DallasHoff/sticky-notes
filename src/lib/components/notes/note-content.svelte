<script lang="ts">
	import { Editor, Viewer } from 'bytemd';
	import type { Note } from '$lib/stores/notes';
	import type { NoteEditorStore } from '$lib/stores/note-editor';

	export let note: Note;
	export let noteEditorStore: NoteEditorStore;

	const { editing, draftContent, draftChange } = noteEditorStore;
</script>

<div class="note-content" data-theme="light">
	{#if $editing}
		<div class="note-content__editor">
			<Editor value={$draftContent} on:change={draftChange} />
		</div>
	{:else}
		<div class="note-content__viewer">
			<Viewer value={note.content} />
		</div>
	{/if}
</div>

<style lang="scss">
	.note-content {
		--font-size: 0.9rem;
		--color: hsl(0 0% 20%);

		&,
		&__editor {
			height: 100%;
		}

		&__viewer {
			min-height: 100%;
			padding: 0.5rem 1rem;
		}
	}
</style>
