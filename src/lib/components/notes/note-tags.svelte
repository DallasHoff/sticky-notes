<script lang="ts">
	import FaXmark from '$icon/fa-xmark.svelte';
	import type { NoteTagsStore } from '$lib/stores/note-tags';
	import type { Tag } from '$lib/stores/tags';
	import Button from '../button.svelte';

	export let noteTags: NoteTagsStore;

	export function focusTextbox() {
		textbox.focus();
	}

	let textbox: HTMLInputElement;
	let newTagLabel: string = '';

	function addTag(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			noteTags.add({ label: newTagLabel });
			newTagLabel = '';
		}
	}

	function removeTag(tagId: Tag['id']) {
		noteTags.remove(tagId);
	}
</script>

<div class="note-tags">
	{#each $noteTags as tag (tag.id)}
		<div class="note-tags__tag">
			{tag.label}
			<Button
				plain
				icon
				size="sm"
				label="Remove tag"
				tooltipPlacement={null}
				on:click={() => removeTag(tag.id)}
			>
				<FaXmark />
			</Button>
		</div>
	{/each}
	<div class="note-tags__textbox" data-tooltip="Add tag">
		<input type="text" bind:this={textbox} bind:value={newTagLabel} on:keypress={addTag} />
	</div>
</div>

<style lang="scss">
	.note-tags {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.3rem;
		padding: 0.4rem 0.75rem;
		border-bottom: 1px solid hsl(0 0% 0% / 0.15);

		&__tag,
		&__textbox input {
			font-size: 1rem;
			width: auto;
			height: auto;
			padding: 0 0.5em;
			margin: 0;
			color: inherit;
			background-color: transparent;
			border: none;
		}

		&__tag {
			display: flex;
			align-items: center;
			gap: 0.4em;
			border: 1px solid hsl(0 0% 0% / 0.4);
			border-radius: 0.8em;
		}

		&__textbox {
			min-width: 0;
			flex: 1 0 0;
			border: none;

			&:focus-within {
				flex-basis: 8rem;
			}

			input {
				display: block;
				width: 100%;

				&:hover,
				&:focus {
					background-color: hsl(0 0% 0% / 0.1);
				}

				&:focus {
					border: 1px solid hsl(0 0% 0% / 0.4);
				}
			}
		}
	}

	@media (min-width: 768px) {
		.note-tags {
			&__tag,
			&__textbox input {
				font-size: 0.8rem;
			}
		}
	}
</style>
