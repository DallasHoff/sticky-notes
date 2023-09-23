<script lang="ts">
	import Modal from '../modal.svelte';
	import { settings } from '$lib/stores';

	const { open, noteScale } = settings;
</script>

<Modal title="Settings" size="sm" bind:open={$open}>
	<label>
		Note Size
		<input
			type="range"
			name="noteScale"
			min="0.80"
			max="1.50"
			step="0.05"
			bind:value={$noteScale}
		/>
	</label>
	<!-- TODO: setting for default note color -->
</Modal>
