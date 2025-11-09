import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import sqlocal from 'sqlocal/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		sqlocal(),
		SvelteKitPWA({
			strategies: 'generateSW',
			registerType: 'prompt',
			manifest: false,
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,wasm}'],
				globIgnores: ['**/apple-splash-*'],
				maximumFileSizeToCacheInBytes: 5000000,
			},
		}),
	],
	build: {
		target: 'esnext',
		chunkSizeWarningLimit: 1500,
	},
	optimizeDeps: {
		exclude: ['bytemd'],
	},
});
