import type { Locale } from "../locales";

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

//
export function NewLocales<T extends Record<string, string>>(
	translations: { "en-US": T } & Partial<Record<Locale, T>>,
) {
	type TranslationKey = keyof T;

	type tParameters<K extends TranslationKey> = ExtractPlaceholdersUnion<
		T[K]
	> extends never
		? [key: K]
		: [
				key: K,
				params: Record<ExtractPlaceholdersUnion<T[K]>, string | number>,
			];

	let locale: Locale = "en-US";

	const setLocale = (newLocale: Locale) => {
		locale = newLocale;
	};

	const t = <K extends TranslationKey>(...tParameters: tParameters<K>) => {
		if (!locale) {
			return "NO CURRENT LOCALE";
		}
		const tryLanguage = translations[locale];
		let text = tryLanguage
			? tryLanguage[tParameters[0]]
			: translations["en-US"][tParameters[0]];
		const parameters = tParameters[1] as T;
		if (parameters) {
			const keys = Object.keys(parameters) as TranslationKey[];
			for (const param of keys) {
				// @ts-expect-error TODO, type completion outside this works good
				text = text.replace(`{${String(param)}}`, parameters[param]);
			}
		}
		return text;
	};

	return {
		setLocale,
		t,
	};
}
