<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let secondary: boolean = false;
	export let icon: boolean = false;
	export let plain: boolean = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let label: string | null = null;
	export let tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' | null = 'top';

	const fontSizes = {
		sm: '0.75rem',
		md: '1rem',
		lg: '1.5rem',
	} satisfies Record<typeof size, `${number}rem`>;
</script>

<button
	{type}
	class="app-button"
	class:secondary
	class:app-button--plain={plain}
	class:app-button--icon={icon}
	style:--size={fontSizes[size]}
	aria-label={label}
	data-tooltip={tooltipPlacement ? label : null}
	data-placement={tooltipPlacement}
	on:click
>
	<slot />
</button>

<style lang="scss">
	.app-button {
		font-size: var(--size, 1rem);
		margin: 0;

		&--plain {
			display: inline-block;
			width: auto;
			line-height: 1;
			color: inherit;
			background: none;
			border: none;
			margin: calc(var(--form-element-spacing-vertical) * -1)
				calc(var(--form-element-spacing-horizontal) * -1);
			--focus-outline: color-mix(in srgb, currentColor 12.5%, transparent);
			--primary-focus: var(--focus-outline);
			--secondary-focus: var(--focus-outline);
			--contrast-focus: var(--focus-outline);
		}

		&--icon {
			display: inline-flex;
			gap: 0.3em;

			& > :global(svg) {
				height: 1em;
				vertical-align: -0.125em;
			}
		}
	}
</style>
