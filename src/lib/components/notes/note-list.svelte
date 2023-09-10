<script lang="ts">
	import NoteCard from '$lib/components/notes/note-card.svelte';
	import { notes } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import { get, type Unsubscriber } from 'svelte/store';

	let noteListElement: HTMLUListElement;
	const noteHeight = 385;
	const noteGap = 16;
	const paddingRows = 2;
	let scrollHeight = 0;
	let scrollOffset = 0;

	let notesOffset = 0;
	let notesLimit = 1000;

	let countUnsubscribe: Unsubscriber;
	const resizeObserver = new ResizeObserver(updateVirtualScroll);

	async function updateVirtualScroll() {
		const notesCount = get(notes.count) ?? 0;
		const columnCount = window
			.getComputedStyle(noteListElement)
			.getPropertyValue('grid-template-columns')
			.split(' ').length;
		const rowHeight = noteHeight + noteGap;
		const fullHeight = Math.ceil(notesCount / columnCount) * rowHeight;
		const windowHeight = window.innerHeight;
		const scrollTop = window.scrollY + noteListElement.offsetTop;

		const offset = Math.max(0, Math.floor(scrollTop / rowHeight) - paddingRows) * columnCount;
		const limit =
			Math.min(notesCount - offset, Math.ceil(windowHeight / rowHeight) + paddingRows) *
			columnCount;

		if (offset === notesOffset && limit === notesLimit) return;

		notesOffset = offset;
		notesLimit = limit;

		await notes.setPage(offset, limit);
		scrollHeight = Math.max(0, fullHeight);
		scrollOffset = (offset / columnCount) * rowHeight;
	}

	onMount(() => {
		countUnsubscribe = notes.count.subscribe(updateVirtualScroll);
		resizeObserver.observe(noteListElement);
		window.addEventListener('scroll', updateVirtualScroll);
	});

	onDestroy(() => {
		countUnsubscribe();
		resizeObserver.disconnect();
		window.removeEventListener('scroll', updateVirtualScroll);
	});
</script>

<ul
	bind:this={noteListElement}
	class="note-list"
	style:--note-height={`${noteHeight}px`}
	style:--note-gap={`${noteGap}px`}
	style:--scroll-height={`${scrollHeight}px`}
	style:--scroll-offset={`translateY(${scrollOffset}px)`}
>
	{#each $notes as note (note.id)}
		<li>
			<NoteCard {note} />
		</li>
	{/each}
</ul>

<style lang="scss">
	.note-list {
		--note-width: 350px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(0, var(--note-width)));
		grid-auto-rows: var(--note-height, calc(var(--note-width) * 1.1));
		gap: var(--note-gap, 1rem);
		justify-content: center;
		height: var(--scroll-height, auto);
		padding: 0;
		margin: 0;

		li {
			list-style-type: none;
			margin: 0;
			transform: var(--scroll-offset, none);

			&:has(.bytemd-fullscreen) {
				transform: none;
			}
		}
	}
</style>
