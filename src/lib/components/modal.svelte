<script lang="ts">
	import Button from './button.svelte';
	import FaXmark from '$icon/fa-xmark.svelte';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean;
	export let title: string;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const dispatch = createEventDispatcher();

	const maxWidths = {
		sm: '400px',
		md: '700px',
		lg: '1000px',
	} satisfies Record<typeof size, `${number}px`>;

	$: {
		const docClassList = document.documentElement.classList;
		const openClasses = ['modal-is-open', 'modal-is-opening'];
		docClassList[open ? 'add' : 'remove'](...openClasses);
	}

	function close() {
		open = false;
		dispatch('close');
	}

	function escape(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			close();
		}
	}
</script>

<svelte:window on:keyup={escape} />
<dialog {open} on:click={close} class="app-modal">
	<article style:--max-width={maxWidths[size]} on:click|stopPropagation>
		<header>
			{title}
			<div class="app-modal__spacer" />
			<Button plain icon size="lg" label="Close" tooltipPlacement={null} on:click={close}>
				<FaXmark />
			</Button>
		</header>
		<slot />
	</article>
</dialog>

<style lang="scss">
	.app-modal {
		article {
			max-width: var(--max-width, none);
			flex: 1 0 0;
		}

		header {
			font-size: 1.2rem;
			display: flex;
			align-items: center;
		}

		&__spacer {
			flex-grow: 1;
		}
	}
</style>
