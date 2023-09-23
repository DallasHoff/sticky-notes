<script lang="ts">
	import FaPalette from '$icon/fa-palette.svelte';
	import { NoteColor, NoteColorArray } from '$lib/db/enums/note-color';
	import Button from '../button.svelte';
	import { notes, themeUpperCase } from '$lib/stores';
	import type { Note } from '$lib/stores/notes';
	import type { NoteEditorStore } from '$lib/stores/note-editor';

	export let note: Note;
	export let noteEditorStore: NoteEditorStore;
	const { expanded, expand } = noteEditorStore;

	function changeColor(color: keyof typeof NoteColor) {
		notes.update(note.id, { color });
		expand(null);
	}
</script>

{#if $expanded !== 'colors'}
	<Button plain icon label="Change color" on:click={() => expand('colors')}>
		<FaPalette />
	</Button>
{:else}
	<div class="color-options">
		{#each NoteColorArray as [color, colorData] (color)}
			<button
				type="button"
				class="color-options__option"
				style:background-color={colorData[$themeUpperCase]}
				aria-label={colorData.LABEL}
				on:click={() => changeColor(color)}
			/>
		{/each}
	</div>
{/if}

<style lang="scss">
	.color-options {
		display: flex;
		gap: 0.15rem;

		&__option {
			width: 1rem;
			height: 1rem;
			padding: 0;
			margin: 0;
			color: inherit;
			border: 2px solid currentColor;
			border-radius: 50%;
		}
	}
</style>
