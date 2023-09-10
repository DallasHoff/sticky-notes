<script lang="ts">
	import { tags } from '$lib/stores';
	import type { TagFilter } from '$lib/stores/tags';
	import { flip } from 'svelte/animate';
	import { scale } from 'svelte/transition';

	const limit = 6;
	let limited = true;
	let tagList: TagFilter[] = [];

	$: tagList = !limited ? $tags : $tags.slice(0, limit);
</script>

<div class="filter-tags">
	{#each tagList as tag (tag.id)}
		<button
			type="button"
			class="filter-tags__tag"
			class:filter-tags__tag--selected={tag.selected}
			animate:flip={{ duration: 300 }}
			in:scale
			on:click={() => tags.toggleSelection(tag.id)}
		>
			{tag.label}
			<span class="filter-tags__matched-notes">({tag.matchedNotes})</span>
		</button>
	{/each}
	{#if $tags.length > limit}
		<button
			type="button"
			class="filter-tags__tag filter-tags__tag--more-toggle"
			on:click={() => (limited = !limited)}
		>
			Show {limited ? 'More' : 'Less'}
		</button>
	{/if}
</div>

<style lang="scss">
	.filter-tags {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.4rem;

		&__tag {
			font-size: 0.9rem;
			width: auto;
			height: auto;
			padding: 0.1rem 0.6rem;
			margin: 0;
			background-color: var(--secondary);
			border-color: var(--secondary);
			border-radius: 1em;
			box-shadow: var(--card-shadow);

			&--selected {
				background-color: var(--primary);
				border-color: var(--primary);
			}

			&--more-toggle {
				background-color: var(--secondary-alt);
				border-color: var(--secondary-alt);
			}
		}

		&__matched-notes {
			color: var(--muted-color);
		}
	}
</style>
