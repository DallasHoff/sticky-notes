<script lang="ts">
	import SettingsButton from '$lib/components/settings/settings-button.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
</script>

<header class="app-header">
	<ThemeToggle />
	<h1 class="app-header__title">Notes</h1>
	<SettingsButton />
</header>

<style lang="scss">
	.app-header {
		z-index: 1;
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		padding: 0.5rem 1rem;
		margin: 0;
		background-color: var(--card-sectionning-background-color);
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
		box-shadow: var(--card-box-shadow);

		&__title {
			flex: 1 0 auto;
			font-size: 1.5rem;
			text-align: center;
			margin: 0;
		}
	}
</style>
