<script lang="ts">
	import FaTags from '$icon/fa-tags.svelte';
	import Button from '../button.svelte';
</script>

<Button icon plain label="Add tags" on:click>
	<FaTags />
</Button>
