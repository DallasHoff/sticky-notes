<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from './modal.svelte';
	import Button from './button.svelte';
	import { persistence } from '$lib/stores';

	let open = false;

	onMount(() => {
		if (!persistence.prompted) {
			open = true;
		}
	});

	function close() {
		persistence.prompt();
		open = false;
	}
</script>

<Modal title="Welcome!" size="sm" noOutsideClick={true} bind:open on:close={close}>
	<p>
		Capture your thoughts for later by writing a quick note. Add tags to categorize it and organize
		your notes.
	</p>
	<p>
		This app keeps all of its data on your device. Your notes are private, never sent to an external
		server.
	</p>
	<footer>
		<Button on:click={close}>Get Started</Button>
	</footer>
</Modal>
