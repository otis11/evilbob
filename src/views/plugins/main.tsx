import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "../../content-script.ts";
import "../../globals.css";
import { automaticThemeUpdateDocument } from "@/lib/theme-preference.ts";
import { getConfig } from "../../lib/config.ts";

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
