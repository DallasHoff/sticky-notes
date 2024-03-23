import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html',
		}),
		alias: {
			$styles: 'src/styles/*',
			$icon: 'src/assets/fontawesome/light/*',
		},
	},
};

export default config;
