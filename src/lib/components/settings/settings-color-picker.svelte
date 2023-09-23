<script lang="ts">
	import FaCircleCheck from '$icon/fa-circle-check.svelte';
	import { NoteColor, NoteColorArray } from '$lib/db/enums/note-color';
	import { themeUpperCase } from '$lib/stores';

	export let value: keyof typeof NoteColor;
</script>

<div class="color-options">
	{#each NoteColorArray as [color, colorData] (color)}
		<div class="color-options__option">
			<input
				type="radio"
				name="defaultNoteColor"
				aria-label={colorData.LABEL}
				value={color}
				bind:group={value}
				class="color-options__control"
				style:background-color={colorData[$themeUpperCase]}
			/>
			{#if value === color}
				<div class="color-options__check-wrapper">
					<div class="color-options__check">
						<FaCircleCheck />
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.color-options {
		display: flex;
		justify-content: space-between;
		gap: 0.4rem;
		margin: 0.3rem 0;

		&__option {
			flex: 1 0 0;
			position: relative;
		}

		&__control {
			width: 100%;
			height: 2.5rem;
			padding: 0;
			margin: 0;
			color: inherit;
			border: 2px solid currentColor;
			border-radius: 0.5rem;

			&:focus {
				border: 2px solid currentColor;
			}
		}

		&__check-wrapper {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__check {
			display: flex;
			width: 1.2rem;
			color: black;
		}
	}

	@media (min-width: 360px) {
		.color-options {
			gap: 0.8rem;
		}
	}
</style>
