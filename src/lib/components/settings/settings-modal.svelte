<script lang="ts">
	import Modal from '../modal.svelte';
	import { settings } from '$lib/stores';
	import SettingsColorPicker from './settings-color-picker.svelte';
	import Button from '../button.svelte';
	import { exportDb } from '$lib/db/export-db';
	import SettingsImportModal from './settings-import-modal.svelte';

	const { open, noteScale, defaultNoteColor } = settings;
	let importModalOpen = false;

	function goToImport() {
		open.set(false);
		importModalOpen = true;
	}
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
	<fieldset>
		<legend>Default Note Color</legend>
		<SettingsColorPicker bind:value={$defaultNoteColor} />
	</fieldset>
	<hr />
	<div class="settings-buttons">
		<Button on:click={exportDb}>Export Notes</Button>
		<Button secondary on:click={goToImport}>Import Notes</Button>
	</div>
</Modal>
<SettingsImportModal bind:open={importModalOpen} />

<style lang="scss">
	.settings-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.75rem;
	}

	hr {
		margin: 1.5rem 0;
	}
</style>
