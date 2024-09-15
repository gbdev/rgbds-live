import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	base: "/rgbds-live/",
	build: {
		target: ["chrome109", "safari15.6", "firefox102"],
		outDir: "www",
	},
	resolve: {
		alias: {
			ace: "ace-builds/src-noconflict/",
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "./node_modules/ace-builds/src-noconflict/**",
					dest: "assets/ace",
				},
			],
		}),
	],
});
