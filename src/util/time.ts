export function unixTimeToHumanReadable(n: number) {
	const now = Date.now();
	const seconds = Math.floor((now - n) / 1000);
	if (seconds < 60) {
		return `${seconds} seconds ago`;
	}
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return `${minutes} minutes ago`;
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours} hours ago`;
	}

	const days = Math.floor(hours / 24);
	if (days < 30) {
		return `${days} days ago`;
	}

	return new Date(n).toLocaleDateString();
}
