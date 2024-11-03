import { defineConfig } from "vite";

export const websiteViteConfig = {
	base: "./",
	server: {
		open: true,
	},
	build: {
		outDir: "./dist/website",
		emptyOutDir: false,
	},
};
export default defineConfig(websiteViteConfig);
