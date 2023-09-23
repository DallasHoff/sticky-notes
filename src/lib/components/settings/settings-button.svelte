<script lang="ts">
	import Button from '../button.svelte';
	import FaGear from '$icon/fa-gear.svelte';
	import { settings } from '$lib/stores';
</script>

<Button plain icon size="lg" label="Settings" on:click={() => settings.open.set(true)}>
	<FaGear />
</Button>
