import {defineConfig} from "vite";

export default defineConfig({
	build: {
		outDir: "www"
	},
	resolve: {
		alias: {
			"ace": "./js/ace"
		}
	}
});
