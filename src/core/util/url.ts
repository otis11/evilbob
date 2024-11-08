export function getSecondLevelDomain(urlString: string) {
	const url = new URL(urlString);
	return url.hostname.split(".").at(-2) || "";
}

export function getDomainWithoutSubdomains(urlString: string) {
	const url = new URL(urlString);
	return `${url.hostname.split(".").at(-2) || ""}.${url.hostname.split(".").at(-1) || ""}`;
}
