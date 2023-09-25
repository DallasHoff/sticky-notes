<script lang="ts">
	import { importDb } from '$lib/db/import-db';
	import Alert from '../alert.svelte';
	import Button from '../button.svelte';
	import Modal from '../modal.svelte';

	export let open: boolean;

	let submitting: boolean = false;
	let noFileError: boolean = false;
	let importFailedError: boolean = false;

	async function submit(event: SubmitEvent) {
		submitting = true;
		noFileError = false;
		importFailedError = false;

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const [dbFile] = formData.getAll('dbFile') as File[];

		if (!dbFile || dbFile.name === '') {
			submitting = false;
			noFileError = true;
			return;
		}

		const importSucceeded = await importDb(dbFile);

		if (importSucceeded === true) {
			form.reset();
			open = false;
		} else {
			importFailedError = true;
		}

		submitting = false;
	}
</script>

<Modal title="Import Notes" size="sm" bind:open>
	<form on:submit|preventDefault={submit}>
		<p>Select a backup file that you exported previously to restore your notes.</p>
		<p>
			<strong>Warning:</strong>
			This will overwrite all of your current notes.
		</p>
		<div class="import-controls">
			<input type="file" name="dbFile" accept=".db" />
			{#if noFileError === true}
				<Alert type="error">Please choose a backup file.</Alert>
			{/if}
			{#if importFailedError === true}
				<Alert type="error">
					Import failed. Please make sure that you selected a notes backup file.
				</Alert>
			{/if}
			<Button type="submit" busy={submitting}>Import</Button>
		</div>
	</form>
</Modal>

<style lang="scss">
	.import-controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-top: 1rem;

		input {
			margin: 0;
		}
	}
</style>
