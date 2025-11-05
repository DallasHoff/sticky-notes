<script lang="ts">
	import FaXmark from '$icon/fa-xmark.svelte';
	import type { NoteTagsStore } from '$lib/stores/note-tags';
	import type { Note } from '$lib/stores/notes';
	import type { Tag } from '$lib/stores/tags';
	import Button from '../button.svelte';

	export let note: Note;
	export let noteTags: NoteTagsStore;
	export let isReadonly: boolean = false;

	export function focusTextbox() {
		textbox.focus();
	}

	let textbox: HTMLInputElement;
	let newTagLabel: string = '';
	let suggestions: string[] = [];

	async function onKeyup(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addTag();
		} else {
			suggestions = await noteTags.search(newTagLabel);
		}
	}

	function addTag() {
		noteTags.add({ label: newTagLabel });
		newTagLabel = '';
		suggestions = [];
	}

	function removeTag(tagId: Tag['id']) {
		noteTags.remove(tagId);
	}
</script>

<div class="note-tags">
	<ul class="note-tags__tag-list" aria-label="Note tags">
		{#each $noteTags as tag (tag.id)}
			<li class="note-tags__tag">
				{tag.label}
				{#if !isReadonly}
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
				{/if}
			</li>
		{/each}
	</ul>
	{#if !isReadonly}
		<div class="note-tags__textbox" data-tooltip="Add tag">
			<input
				type="text"
				bind:this={textbox}
				name="newTag"
				aria-label="New tag"
				list={`note-tag--${note.id}`}
				bind:value={newTagLabel}
				on:keyup={onKeyup}
			/>
			<datalist id={`note-tag--${note.id}`}>
				{#each suggestions as suggestion}
					<option value={suggestion} />
				{/each}
			</datalist>
		</div>
	{/if}
</div>

<style lang="scss">
	.note-tags {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.3rem;
		padding: 0.4rem 0.75rem;
		border-bottom: 1px solid hsl(0 0% 0% / 0.15);

		&__tag-list {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 0.3rem;
			margin: 0;
			padding: 0;
			color: inherit;
		}

		&__tag,
		&__textbox input {
			font-size: 0.8rem;
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

				&::-webkit-calendar-picker-indicator {
					display: none !important;
				}
			}
		}
	}
</style>
