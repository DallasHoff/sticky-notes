<script lang="ts">
	import FaPalette from '$icon/fa-palette.svelte';
	import { NoteColor } from '$lib/db/enums/note-color';
	import Button from '../button.svelte';
	import { notes, themeUpperCase } from '$lib/stores';
	import type { Note } from '$lib/stores/notes';

	export let note: Note;

	let selectingColor: boolean = false;

	const colors = Object.entries(NoteColor) as [
		[keyof typeof NoteColor, (typeof NoteColor)[keyof typeof NoteColor]]
	];

	function changeColor(color: keyof typeof NoteColor) {
		notes.update(note.id, { color });
		selectingColor = false;
	}
</script>

{#if !selectingColor}
	<Button plain icon label="Change color" on:click={() => (selectingColor = true)}>
		<FaPalette />
	</Button>
{:else}
	<div class="color-options">
		{#each colors as [color, colorData] (color)}
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
