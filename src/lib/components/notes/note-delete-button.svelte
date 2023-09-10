<script lang="ts">
	import FaTrash from '$icon/fa-trash.svelte';
	import Button from '../button.svelte';
	import { notes } from '$lib/stores';
	import type { Note } from '$lib/stores/notes';
	import FaCircleXmark from '$icon/fa-circle-xmark.svelte';
	import FaCircleCheck from '$icon/fa-circle-check.svelte';

	export let note: Note;

	let confirming: boolean = false;
</script>

{#if !confirming}
	<Button plain icon label="Delete note" on:click={() => (confirming = true)}>
		<FaTrash />
	</Button>
{:else}
	<div class="note-delete-confirmation">
		<span>Delete?</span>
		<Button plain icon label="Confirm deletion" on:click={() => notes.remove(note.id)}>
			<FaCircleCheck />
		</Button>
		<Button plain icon label="Cancel deletion" on:click={() => (confirming = false)}>
			<FaCircleXmark />
		</Button>
	</div>
{/if}

<style lang="scss">
	.note-delete-confirmation {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
</style>
