import { iconFromString, iconGoogle } from "../../icons";
import { ResultGroup } from "../result-group";
import type { Result } from "../result/result";
import { ResultGoToUrl } from "../result/result-go-to-url";
export class ResultGroupGoogleNew extends ResultGroup {
	public prefix?: string | undefined = "gn";
	description = "Create new google docs, sheets, slides ... ";

	public async getResults(): Promise<Result[]> {
		return [
			new ResultGoToUrl({
				title: "New Google Docs",
				description: "Create a new Google Docs sheet.",
				url: "https://docs.new",
				prepend: iconFromString(iconGoogle),
			}),
			new ResultGoToUrl({
				title: "New Google Slides",
				description: "Create a new Google Slides presentation",
				url: "https://slides.new",
				prepend: iconFromString(iconGoogle),
			}),
			new ResultGoToUrl({
				title: "New Google Sheets",
				description: "Create a new Google Sheet",
				url: "https://sheets.new",
				prepend: iconFromString(iconGoogle),
			}),
			new ResultGoToUrl({
				title: "New Google Sites",
				description: "Create a new Google Site",
				url: "https://sites.new",
				prepend: iconFromString(iconGoogle),
			}),
			new ResultGoToUrl({
				title: "New Google Keep",
				description: "Create a new Google Keep note",
				url: "https://keep.new",
				prepend: iconFromString(iconGoogle),
			}),
			new ResultGoToUrl({
				title: "New Google Calendar entry",
				description: "Create a new Google Calendar entry",
				url: "https://cal.new",
				prepend: iconFromString(iconGoogle),
			}),
		];
	}
}
