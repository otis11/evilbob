import { ResultGroup } from "../result-group";
import type { Result } from "../result/result";
import { ResultGoToUrl } from "../result/result-go-to-url";

export class ResultGroupGoogleNew extends ResultGroup {
	public prefix?: string | undefined = "gn";
	description = "Create new google docs, sheets, slides ... ";

	public async getResults(): Promise<Result[]> {
		return [
			new ResultGoToUrl(
				"New Google Docs",
				"Create a new Google Docs sheet.",
				"https://docs.new",
			),
			new ResultGoToUrl(
				"New Google Slides",
				"Create a new Google Slides presentation",
				"https://slides.new",
			),
			new ResultGoToUrl(
				"New Google Sheets",
				"Create a new Google Sheet",
				"https://sheets.new",
			),
			new ResultGoToUrl(
				"New Google Sites",
				"Create a new Google Site",
				"https://sites.new",
			),
			new ResultGoToUrl(
				"New Google Keep",
				"Create a new Google Keep note",
				"https://keep.new",
			),
			new ResultGoToUrl(
				"New Google Calendar entry",
				"Create a new Google Calendar entry",
				"https://meeting.new",
			),
		];
	}
}
