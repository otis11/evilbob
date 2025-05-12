import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "../../content-script.ts";
import "../../globals.css";
import { automaticThemeUpdateDocument } from "@/lib/theme-preference.ts";

automaticThemeUpdateDocument();
const root = document.getElementById("root");
if (root) {
	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
