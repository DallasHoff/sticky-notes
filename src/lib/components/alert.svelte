<script lang="ts">
	import FaCircleExclamation from '$icon/fa-circle-exclamation.svelte';
	import FaCircleInfo from '$icon/fa-circle-info.svelte';
	import FaTriangleExclamation from '$icon/fa-triangle-exclamation.svelte';

	export let type: 'info' | 'warning' | 'error' | null = null;
</script>

<div role="alert" class="app-alert app-alert--{type}">
	{#if type !== null}
		<div class="app-alert__icon">
			{#if type === 'info'}
				<FaCircleInfo />
			{:else if type === 'warning'}
				<FaTriangleExclamation />
			{:else if type === 'error'}
				<FaCircleExclamation />
			{/if}
		</div>
	{/if}
	<p><slot /></p>
</div>

<style lang="scss">
	.app-alert {
		--type-color: currentColor;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 1rem;
		background-color: var(--card-sectionning-background-color);
		border: 1px solid var(--type-color);
		border-radius: var(--border-radius);

		&__icon {
			flex: 0 0 1rem;
			color: var(--type-color);
		}

		&--info {
			--type-color: var(--primary);
		}

		&--warning {
			--type-color: hsl(44 93% 37%);
		}

		&--error {
			--type-color: hsl(0 70% 53%);
		}
	}
</style>
