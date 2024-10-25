export function isElementInViewport(el: HTMLElement) {
	const rect = el.getBoundingClientRect();
	const width = window.innerWidth || document.documentElement.clientWidth;
	const height = window.innerHeight || document.documentElement.clientHeight;

	return (
		rect.top >= 0 &&
		rect.right <= width &&
		rect.bottom <= height &&
		rect.left >= 0
	);
}
