<script lang="ts">
	import AppHeader from '$lib/components/app-header.svelte';
	import AppUpdatePrompt from '$lib/components/app-update-prompt.svelte';
	import FilterTags from '$lib/components/filter-tags.svelte';
	import NoteAddButton from '$lib/components/notes/note-add-button.svelte';
	import NoteListPlaceholder from '$lib/components/notes/note-list-placeholder.svelte';
	import NoteList from '$lib/components/notes/note-list.svelte';
	import SettingsModal from '$lib/components/settings/settings-modal.svelte';
	import WelcomeModal from '$lib/components/welcome-modal.svelte';
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
<WelcomeModal />
<SettingsModal />
<AppUpdatePrompt />

<style lang="scss">
	main {
		padding: 1.5rem 1.5rem 7.5rem;
	}

	section:last-of-type {
		margin: 0;
	}
</style>
