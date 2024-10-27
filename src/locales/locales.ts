import enUS from "./en-US";
import { NewLocales } from "./new-locales";

export const locales = {
	"en-US": enUS,
};

export const LOCALES = Object.keys(locales) as Locale[];
export type Locale = keyof typeof locales;
export const { setLocale, t } = NewLocales(locales);
