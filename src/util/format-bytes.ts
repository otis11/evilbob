export function formatBytes(bytes: number) {
	const kib = bytes / 1024;
	const mib = kib / 1024;
	const gib = mib / 1024;
	return `${gib.toFixed(1)}`.replace(".", ",");
}
