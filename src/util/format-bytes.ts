export function formatBytes(bytes: number, withUnit = false) {
	const kib = bytes / 1024;
	if (kib < 1000) {
		return `${f(kib)} ${withUnit ? "KB" : ""}`;
	}
	const mib = kib / 1024;
	if (mib < 1000) {
		return `${f(mib)} ${withUnit ? "MB" : ""}`;
	}
	const gib = mib / 1024;
	return `${f(gib)} ${withUnit ? "GB" : ""}`;
}

function f(x: number) {
	return x.toFixed(2).replace(".", ",");
}
