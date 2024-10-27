import { iconFromString, iconGoogle } from "../../icons";
import { ResultGroup } from "../result-group";
import { GoToUrl } from "../result/go-to-url";
import type { Result } from "../result/result";
export class GoogleNew extends ResultGroup {
	public prefix?: string | undefined = "gn";
	public description(): string {
		return "Create new google docs, sheets, slides ... ";
	}

	public id(): string {
		return "google-new";
	}

	public name(): string {
		return "Google New";
	}

	public async getResults(): Promise<Result[]> {
		return [
			new GoToUrl({
				title: "New Google Docs",
				description: "Create a new Google Docs sheet.",
				url: "https://docs.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: "New Google Slides",
				description: "Create a new Google Slides presentation",
				url: "https://slides.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: "New Google Sheets",
				description: "Create a new Google Sheet",
				url: "https://sheets.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: "New Google Sites",
				description: "Create a new Google Site",
				url: "https://sites.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: "New Google Keep",
				description: "Create a new Google Keep note",
				url: "https://keep.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: "New Google Calendar entry",
				description: "Create a new Google Calendar entry",
				url: "https://cal.new",
				prepend: iconFromString(iconGoogle),
			}),
		];
	}
}
