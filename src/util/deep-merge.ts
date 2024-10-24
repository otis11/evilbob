export function deepMerge(
	// biome-ignore lint: any
	target: Record<string, any>,
	// biome-ignore lint: any
	source: Record<string, any>,
) {
	for (const key in source) {
		if (Object.hasOwn(source, key)) {
			if (isJsObject(source[key])) {
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
