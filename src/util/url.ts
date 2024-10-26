export function getSecondLevelDomain(urlString: string) {
	const url = new URL(urlString);
	return url.hostname.split(".").at(-2) || "";
}

export function getTopLevelDomain(urlString: string) {
	const url = new URL(urlString);
	return url.hostname.split(".").at(-1) || "";
}
