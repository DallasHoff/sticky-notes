<script lang="ts">
	import { importDb } from '$lib/db/import-db';
	import Button from '../button.svelte';
	import Modal from '../modal.svelte';

	export let open: boolean;

	async function submit(event: SubmitEvent) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const [dbFile] = formData.getAll('dbFile') as File[];

		if (!dbFile || dbFile.name === '') {
			// TODO: message that no file was selected
			return;
		}

		const importSucceeded = await importDb(dbFile);

		if (importSucceeded === true) {
			form.reset();
			open = false;
		} else {
			// TODO: message that import failed
		}
	}
</script>

<Modal title="Import Notes" size="sm" bind:open>
	<form on:submit|preventDefault={submit}>
		<p>Select a backup file that you exported previously to restore your notes.</p>
		<p>
			<strong>Warning:</strong>
			This will overwrite all of your current notes.
		</p>
		<input type="file" name="dbFile" accept=".db" />
		<Button type="submit">Import</Button>
	</form>
</Modal>

<style lang="scss">
	input {
		margin: 1rem 0 1.5rem;
	}
</style>
