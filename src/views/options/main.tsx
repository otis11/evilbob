import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "../../content-script.ts";
import "../../globals.css";
import { getConfig } from "@/lib/config.ts";
import { automaticThemeUpdateDocument } from "@/lib/theme-preference.ts";

automaticThemeUpdateDocument();
getConfig().then((config) => {
	const root = document.getElementById("root");
	if (root) {
		createRoot(root).render(
			<StrictMode>
				<App config={config} />
			</StrictMode>,
		);
	}
});
