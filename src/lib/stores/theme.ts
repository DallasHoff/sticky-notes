import { writable, type Readable, get } from 'svelte/store';

export type Theme = 'light' | 'dark';

export class ThemeStore implements Readable<Theme> {
	private theme = writable<Theme>(
		(localStorage.getItem('theme') as Theme | null) ??
			(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
	);

	readonly themeColor: Record<Theme, string> = {
		light: '#fbfbfc',
		dark: '#18232c',
	};

	constructor() {
		this.apply(get(this.theme));
	}

	private apply = (theme: Theme) => {
		const themeMetaTag = document.querySelector('meta[name="theme-color"]');
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('theme', theme);
		themeMetaTag?.setAttribute('content', this.themeColor[theme]);
	};

	subscribe = this.theme.subscribe;

	toggle = () => {
		this.theme.update((currentTheme) => {
			const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
			this.apply(newTheme);
			return newTheme;
		});
	};
}
