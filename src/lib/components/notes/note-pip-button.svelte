<script lang="ts">
	import FaPictureInPicture from '$icon/fa-picture-in-picture.svelte';
	import { pipNote } from '$lib/stores';
	import type { NoteTagsStore } from '$lib/stores/note-tags';
	import type { Note } from '$lib/stores/notes';
	import Button from '../button.svelte';

	export let note: Note;
	export let noteTags: NoteTagsStore;
</script>

<Button plain icon label="Pop out note" on:click={() => pipNote.openPipNoteCard(note, noteTags)}>
	<FaPictureInPicture />
</Button>
