<script lang="ts">
	import NoteCard from '$lib/components/notes/note-card.svelte';
	import { notes, settings } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { get, type Unsubscriber } from 'svelte/store';

	let noteListElement: HTMLUListElement;
	const noteHeight = 385;
	const noteGap = 16;
	const paddingRows = 2;
	let scrollHeight = 0;
	let scrollOffset = 0;

	let notesOffset = 0;
	let notesLimit = 100;
	let prevNotesCount = 0;
	let prevRowHeight = 0;

	let flipDuration = 0;
	let flipTimeout: ReturnType<typeof setTimeout> | undefined;

	const { noteScale } = settings;
	let scaleUnsubscribe: Unsubscriber;
	let countUnsubscribe: Unsubscriber;
	const resizeObserver = new ResizeObserver(updateVirtualScroll);

	async function updateVirtualScroll() {
		const notesCount = get(notes.count) ?? 0;
		const columnCount = window
			.getComputedStyle(noteListElement)
			.getPropertyValue('grid-template-columns')
			.split(' ').length;
		const rowHeight = Math.floor(noteHeight * get(noteScale)) + noteGap;
		const fullHeight = Math.ceil(notesCount / columnCount) * rowHeight;
		const windowHeight = window.innerHeight;
		const scrollTop = window.scrollY + noteListElement.offsetTop;

		const offset = Math.max(0, Math.floor(scrollTop / rowHeight) - paddingRows) * columnCount;
		const limit =
			Math.min(notesCount - offset, Math.ceil(windowHeight / rowHeight) + paddingRows * 2) *
			columnCount;

		if (notesCount !== prevNotesCount) {
			flipDuration = 300;
			clearTimeout(flipTimeout);
			flipTimeout = setTimeout(() => {
				flipDuration = 0;
			}, 300);
		}

		if (
			offset === notesOffset &&
			limit === notesLimit &&
			notesCount === prevNotesCount &&
			rowHeight === prevRowHeight
		) {
			return;
		}

		notesOffset = offset;
		notesLimit = limit;
		prevNotesCount = notesCount;
		prevRowHeight = rowHeight;

		await notes.setPage(offset, limit);
		scrollHeight = Math.max(0, fullHeight);
		scrollOffset = (offset / columnCount) * rowHeight;
	}

	onMount(() => {
		scaleUnsubscribe = settings.noteScale.subscribe(updateVirtualScroll);
		countUnsubscribe = notes.count.subscribe(updateVirtualScroll);
		resizeObserver.observe(noteListElement);
		window.addEventListener('scroll', updateVirtualScroll);
	});

	onDestroy(() => {
		scaleUnsubscribe();
		countUnsubscribe();
		resizeObserver.disconnect();
		window.removeEventListener('scroll', updateVirtualScroll);
	});
</script>

<ul
	bind:this={noteListElement}
	class="note-list"
	style:--note-height={`${Math.floor(noteHeight * $noteScale)}px`}
	style:--note-gap={`${noteGap}px`}
	style:--scroll-height={`${scrollHeight}px`}
	style:--scroll-offset={`translateY(${scrollOffset}px)`}
>
	{#each $notes as note (note.id)}
		<li
			class="note-list__item"
			class:note-list__item--no-flip={flipDuration === 0}
			animate:flip={{ duration: flipDuration }}
		>
			<NoteCard {note} />
		</li>
	{/each}
</ul>

<style lang="scss">
	.note-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(0, calc(var(--note-height, 385px) * 0.92)));
		grid-auto-rows: var(--note-height, 385px);
		gap: var(--note-gap, 1rem);
		justify-content: center;
		height: var(--scroll-height, auto);
		padding: 0;
		margin: 0;

		&__item {
			list-style-type: none;
			margin: 0;
			transform: var(--scroll-offset, none);

			&--no-flip {
				animation: none !important;
			}

			&:has(.bytemd-fullscreen) {
				transform: none;
			}
		}
	}
</style>
