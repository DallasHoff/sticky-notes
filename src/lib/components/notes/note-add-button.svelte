<script lang="ts">
	import FaPlus from '$icon/fa-plus.svelte';
	import { notes } from '$lib/stores';
</script>

<button
	type="button"
	aria-label="Add note"
	data-tooltip="Add note"
	data-placement="left"
	on:click={() => notes.add(undefined, true)}
>
	<FaPlus />
</button>

<style lang="scss">
	button {
		position: fixed;
		bottom: 2rem;
		right: 1rem;
		width: 4rem;
		height: 4rem;
		margin: 0;
		border-radius: 50%;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

		& > :global(svg) {
			width: 2rem;
		}
	}
</style>
