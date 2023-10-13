import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'configure-response-headers',
			configureServer: (server) => {
				server.middlewares.use((_req, res, next) => {
					res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
					res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
					next();
				});
			},
		},
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
	},
	optimizeDeps: {
		exclude: ['sqlocal', 'bytemd'],
	},
});
