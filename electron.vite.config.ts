import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	main: {
		plugins: [tsconfigPaths(), externalizeDepsPlugin()],
	},
	preload: {
		plugins: [tsconfigPaths(), externalizeDepsPlugin()],
	},
	renderer: {
		plugins: [tsconfigPaths(), svelte()],
	},
});
