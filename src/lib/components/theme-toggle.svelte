<script lang="ts">
	import FaSun from '$icon/fa-sun.svelte';
	import FaMoonStars from '$icon/fa-moon-stars.svelte';
	import Button from './button.svelte';
	import { theme } from '$lib/stores';
</script>

<Button
	plain
	icon
	size="lg"
	label={`Switch to ${$theme === 'dark' ? 'light' : 'dark'} theme`}
	on:click={theme.toggle}
>
	{#if $theme === 'dark'}
		<FaMoonStars />
	{:else}
		<FaSun />
	{/if}
</Button>
