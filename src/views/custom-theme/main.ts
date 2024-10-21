import "../../theme";
import { getCustomTheme, setCustomTheme } from "../../theme";
import "../global.css";
import "./main.css";

const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
getCustomTheme().then((theme) => {
	textarea.value = theme;
});

textarea.addEventListener("input", () => {
	setCustomTheme(textarea.value);
});
