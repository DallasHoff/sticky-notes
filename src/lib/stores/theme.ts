import { writable, type Readable } from 'svelte/store';

export type Theme = 'light' | 'dark';

export class ThemeStore implements Readable<Theme> {
	private theme = writable<Theme>(
		(localStorage.getItem('theme') as Theme | null) ??
			(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
	);

	constructor() {
		const themeMetaTag = document.querySelector('meta[name="theme-color"]');

		this.theme.subscribe((newTheme) => {
			document.documentElement.dataset.theme = newTheme;
			localStorage.setItem('theme', newTheme);
			themeMetaTag?.setAttribute('content', newTheme === 'dark' ? '#18232c' : '#fbfbfc');
		});
	}

	subscribe = this.theme.subscribe;
	set = this.theme.set;

	toggle = () => {
		this.theme.update((currentTheme) => {
			return currentTheme === 'dark' ? 'light' : 'dark';
		});
	};
}
