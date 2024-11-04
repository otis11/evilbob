import { defineBobPlugin } from "../../core/BobPlugin";
import type { Result } from "../../core/components/result/result";
import { NewUrlResult } from "../../core/components/result/simpe-result.ts";
import { iconFromString, iconGoogle } from "../../core/icons";
import type { Locale } from "../../core/locales";
import { NewLocales } from "../../core/locales/new-locales";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});
export default defineBobPlugin({
	icon: iconGoogle,
	prefix: "gn",
	description() {
		return t("GoogleNew.description");
	},

	name() {
		return t("GoogleNew");
	},
	onLocalChange(locale: Locale) {
		setLocale(locale);
	},
	async provideResults(): Promise<Result[]> {
		return [
			NewUrlResult({
				title: t("GoogleNewDocs.title"),
				description: t("GoogleNewDocs.description"),
				url: "https://docs.new",
				prepend: iconFromString(iconGoogle),
			}),
			NewUrlResult({
				title: t("GoogleNewSlides.title"),
				description: t("GoogleNewSlides.description"),
				url: "https://slides.new",
				prepend: iconFromString(iconGoogle),
			}),
			NewUrlResult({
				title: t("GoogleNewSheets.title"),
				description: t("GoogleNewSheets.description"),
				url: "https://sheets.new",
				prepend: iconFromString(iconGoogle),
			}),
			NewUrlResult({
				title: t("GoogleNewSites.title"),
				description: t("GoogleNewSites.description"),
				url: "https://sites.new",
				prepend: iconFromString(iconGoogle),
			}),
			NewUrlResult({
				title: t("GoogleNewKeep.title"),
				description: t("GoogleNewKeep.description"),
				url: "https://keep.new",
				prepend: iconFromString(iconGoogle),
			}),
			NewUrlResult({
				title: t("GoogleNewCal.title"),
				description: t("GoogleNewCal.description"),
				url: "https://cal.new",
				prepend: iconFromString(iconGoogle),
			}),
		];
	},
});
