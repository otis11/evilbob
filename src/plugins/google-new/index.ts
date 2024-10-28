import { defineBobPlugin } from "../../core/BobPlugin";
import { GoToUrl } from "../../core/components/result/go-to-url";
import type { Result } from "../../core/components/result/result";
import { iconFromString, iconGoogle } from "../../core/icons";
import { NewLocales } from "../../core/locales/new-locales";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});
export default defineBobPlugin({
	prefix: "gn",
	description() {
		return t("GoogleNew.description");
	},

	name() {
		return t("GoogleNew");
	},
	async provideResults(): Promise<Result[]> {
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
	},
});
