import {
	AllAppleDeviceNames,
	createAppleSplashScreens,
	defineConfig,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
	images: ['static/favicon.svg'],
	preset: {
		transparent: { sizes: [] },
		maskable: { sizes: [] },
		apple: { sizes: [] },
		appleSplashScreens: createAppleSplashScreens(
			{
				name: (landscape, size, dark) => {
					return `splash/apple-splash-${landscape ? 'landscape' : 'portrait'}-${
						typeof dark === 'boolean' ? (dark ? 'dark-' : 'light-') : ''
					}${size.width}x${size.height}.png`;
				},
				padding: 0.8,
				resizeOptions: { background: '#fbfbfc', fit: 'contain' },
				darkResizeOptions: { background: '#18232c', fit: 'contain' },
				linkMediaOptions: {
					basePath: '/',
					log: true,
					addMediaScreen: false,
				},
				png: {
					compressionLevel: 9,
					quality: 60,
				},
			},
			[...AllAppleDeviceNames]
		),
	},
});
