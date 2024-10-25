import { iconFromString, iconGithub } from "../../icons";

export function renderFooter() {
	const footer = document.createElement("footer");

	const githubIcon = iconFromString(iconGithub, "48px");
	const githubLink = document.createElement("a");
	githubLink.href = "https://github.com/otis11/bob-command-palette";
	githubLink.target = "_blank";
	githubLink.append(githubIcon);

	footer.append(githubLink);
	document.body.append(footer);
}
