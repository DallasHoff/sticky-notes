<script lang="ts">
	import AppHeader from '$lib/components/app-header.svelte';
	import FilterTags from '$lib/components/filter-tags.svelte';
	import NoteAddButton from '$lib/components/notes/note-add-button.svelte';
	import NoteListPlaceholder from '$lib/components/notes/note-list-placeholder.svelte';
	import NoteList from '$lib/components/notes/note-list.svelte';
	import SettingsModal from '$lib/components/settings/settings-modal.svelte';
	import { notes, tags } from '$lib/stores';

	const notesCount = notes.count;
</script>

<AppHeader />
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
<SettingsModal />

<style lang="scss">
	main {
		margin: 1.5rem 1.5rem 7.5rem;
	}
</style>
