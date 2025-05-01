import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "../../content-script.ts";
import "../../theme.css";
import { getConfig } from "../../config/config.ts";

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
