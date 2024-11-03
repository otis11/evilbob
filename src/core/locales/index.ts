import { PLUGINS_LOADED } from "../plugins.ts";
import enUS from "./en-US";
import { NewLocales } from "./new-locales";

export const locales = {
	"en-US": enUS,
};

export const LOCALES = Object.keys(locales) as Locale[];
export type Locale = keyof typeof locales;
const { t, setLocale } = NewLocales(locales);
export const coreI18n = {
	t,
	setLocale: (locale: Locale) => {
		for (const plugin of PLUGINS_LOADED) {
			plugin.onLocalChange?.(locale);
		}
		setLocale(locale);
	},
};
