import {defineConfig} from "vite";

export default defineConfig({
	base: '/rgbds-live/',
	build: {
		outDir: "www"
	},
	resolve: {
		alias: {
			"ace": "./js/ace"
		}
	}
});
