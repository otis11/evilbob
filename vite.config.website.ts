import { defineConfig } from "vite";

export const websiteViteConfig = {
	base: "./",
	build: {
		outDir: "./dist/website",
		emptyOutDir: false,
	},
};

export default defineConfig(websiteViteConfig);
