import { iconFromString, iconGoogle } from "../../icons";
import { t } from "../../locale";
import { ResultGroup } from "../result-group";
import { GoToUrl } from "../result/go-to-url";
import type { Result } from "../result/result";
export class GoogleNew extends ResultGroup {
	public prefix?: string | undefined = "gn";
	public description(): string {
		return t("GoogleNew.description");
	}

	public id(): string {
		return "google-new";
	}

	public name(): string {
		return t("GoogleNew");
	}

	public async getResults(): Promise<Result[]> {
		return [
			new GoToUrl({
				title: t("GoogleNewDocs.title"),
				description: t("GoogleNewDocs.description"),
				url: "https://docs.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: t("GoogleNewSlides.title"),
				description: t("GoogleNewSlides.description"),
				url: "https://slides.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: t("GoogleNewSheets.title"),
				description: t("GoogleNewSheets.description"),
				url: "https://sheets.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: t("GoogleNewSites.title"),
				description: t("GoogleNewSites.description"),
				url: "https://sites.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: t("GoogleNewKeep.title"),
				description: t("GoogleNewKeep.description"),
				url: "https://keep.new",
				prepend: iconFromString(iconGoogle),
			}),
			new GoToUrl({
				title: t("GoogleNewCal.title"),
				description: t("GoogleNewCal.description"),
				url: "https://cal.new",
				prepend: iconFromString(iconGoogle),
			}),
		];
	}
}
