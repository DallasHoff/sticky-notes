<script lang="ts">
	import FaPictureInPicture from '$icon/fa-picture-in-picture.svelte';
	import { pipNote } from '$lib/stores';
	import type { Note } from '$lib/stores/notes';
	import Button from '../button.svelte';

	export let note: Note;
</script>

<Button plain icon label="Pop out note" on:click={() => pipNote.openPipNoteCard(note)}>
	<FaPictureInPicture />
</Button>
