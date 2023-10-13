<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import Button from './button.svelte';

	const { needRefresh, updateServiceWorker } = useRegisterSW({
		onRegisteredSW(swUrl, registration) {
			if (!registration) return;

			setInterval(async () => {
				if (!(!registration.installing && navigator)) return;
				if ('connection' in navigator && !navigator.onLine) return;

				const sw = await fetch(swUrl, {
					cache: 'no-store',
					headers: {
						cache: 'no-store',
						'cache-control': 'no-cache',
					},
				});

				if (sw?.status === 200) await registration.update();
			}, 60 * 60 * 1000);
		},
	});

	function close() {
		needRefresh.set(false);
	}
</script>

{#if $needRefresh}
	<div role="alert" class="app-update-prompt">
		<p class="app-update-prompt__text">The app has been updated. Reload to update.</p>
		<div class="app-update-prompt__buttons">
			<Button on:click={() => updateServiceWorker(true)}>Reload</Button>
			<Button secondary on:click={close}>Dismiss</Button>
		</div>
	</div>
{/if}

<style lang="scss">
	.app-update-prompt {
		position: fixed;
		left: 1rem;
		bottom: 2rem;
		padding: 1rem;
		min-width: 200px;
		max-width: calc(50vw - 1rem);
		border-radius: var(--border-radius);
		background-color: var(--secondary-alt);
		box-shadow: var(--card-shadow);

		&__text {
			color: var(--primary-inverse);
			text-wrap: pretty;
		}

		&__buttons {
			display: flex;
			gap: 0.5rem;
			width: fit-content;
			margin-right: auto;
		}
	}
</style>
