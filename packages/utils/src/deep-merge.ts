export function deepMerge(
	// biome-ignore lint: any
	target: Record<string, any>,
	// biome-ignore lint: any
	source: Record<string, any>,
) {
	for (const key in source) {
		if (Object.hasOwn(source, key)) {
			if (isJsObject(source[key])) {
				if (!Object.hasOwn(source, key)) continue;
				// https://github.com/otis11/evil-bob/security/code-scanning/1
				if (key === "__proto__" || key === "constructor") continue;
				if (
					!target[key] ||
					typeof target[key] !== "object" ||
					Array.isArray(target[key])
				) {
					target[key] = {};
				}
				deepMerge(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
}

// biome-ignore lint: any
function isJsObject(obj: any) {
	return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}
