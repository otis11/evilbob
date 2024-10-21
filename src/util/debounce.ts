let debounceTimeout: number | Timer = 0;

export function debounce(callback: () => void, ms = 200) {
	if (debounceTimeout) {
		clearTimeout(debounceTimeout);
	}
	debounceTimeout = setTimeout(callback, 200);
}
