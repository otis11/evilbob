export function getLiFromEvent(event: Event) {
	if (!(event.target instanceof HTMLElement)) {
		return null;
	}
	if (event.target.tagName === "LI") {
		return event.target;
	}
	return event.target.closest("li");
}
