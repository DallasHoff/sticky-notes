<script lang="ts">
	import FilterTags from '$lib/components/filter-tags.svelte';
	import NoteAddButton from '$lib/components/notes/note-add-button.svelte';
	import NoteListPlaceholder from '$lib/components/notes/note-list-placeholder.svelte';
	import NoteList from '$lib/components/notes/note-list.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { notes, tags } from '$lib/stores';

	const notesCount = notes.count;
</script>

<header>
	<h1>Notes</h1>
	<ThemeToggle />
</header>
<main>
	<section hidden={$tags.length === 0}>
		<FilterTags />
	</section>
	<section>
		{#if $notesCount}
			<NoteList />
		{:else if $notesCount === 0}
			<NoteListPlaceholder />
		{/if}
		<NoteAddButton />
	</section>
</main>

<style lang="scss">
	header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.2rem;
		margin: 1.5rem;

		h1 {
			margin: 0;
		}
	}

	main {
		margin: 1.5rem 1.5rem 7.5rem;
	}
</style>
