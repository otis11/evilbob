import type enUS from "./en-US";
import { translations } from "./translations";

let locale: Locale;

export const LOCALES = Object.keys(translations) as Locale[];
export type Translations = typeof enUS;
type TranslationKey = keyof Translations;
export type Locale = keyof typeof translations;

// Typescript Magic
// ${string}                                matches anything before a placeholder
// {${infer Param}}                         matches the string betwewen { }
// ${infer Rest}                            matches the rest of the string
// Param | ExtractPlaceholders<Rest>        creates a union type and recursively searches for another placeholder, until no placeholder is left.
// examples
// type b = ExtractPlaceholdersUnion<'hello {wow} {b}'> -> 'wow' | 'b'
// type b = ExtractPlaceholdersUnion<'hello'> -> never
type ExtractPlaceholdersUnion<T extends string> =
	T extends `${string}{${infer Param}}${infer Rest}`
		? Param | ExtractPlaceholdersUnion<Rest>
		: never;

type tParameters<K extends TranslationKey> = ExtractPlaceholdersUnion<
	Translations[K]
> extends never
	? [key: K]
	: [
			key: K,
			params: Record<
				ExtractPlaceholdersUnion<Translations[K]>,
				string | number
			>,
		];

export function t<K extends TranslationKey>(...tParameters: tParameters<K>) {
	console.log(tParameters, locale);
	if (!locale) {
		return "NO CURRENT LOCALE";
	}
	let text = translations[locale][tParameters[0]];
	const parameters = tParameters[1] as Translations;
	if (parameters) {
		const keys = Object.keys(parameters) as TranslationKey[];
		for (const param of keys) {
			text = text.replace(`{${param}}`, parameters[param]);
		}
	}
	return text;
}

export function setLocale(newLocale: Locale) {
	console.log(newLocale, "setlocale");
	locale = newLocale;
}
