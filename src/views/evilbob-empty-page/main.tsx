import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../content-script.ts";
import App from "./App.tsx";
import "../../globals.css";

const root = document.getElementById("root");
if (root) {
	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
