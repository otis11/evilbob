export function iconFromString(html: string) {
	const span = document.createElement("span");
	span.classList.add("icon");
	span.innerHTML = html;
	return span;
}

export function iconFromUrl(url: string | undefined, fallbackIcon: string) {
	if (!url) {
		return iconFromString(fallbackIcon);
	}
	const domain = new URL(url).hostname;

	const span = document.createElement("span");
	span.classList.add("icon");
	const faviconUrl = `https://${domain}/favicon.ico`;
	const img = document.createElement("img");
	img.src = faviconUrl;
	img.alt = "Favicon";
	img.classList.add("icon");
	img.onerror = () => {
		img.outerHTML = iconFromString(fallbackIcon).outerHTML;
	};
	span.append(img);
	return span;
}

export const iconBookmark =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>bookmark</title><path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" /></svg>';
export const iconCpu =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>cpu-64-bit</title><path d="M9,3V5H7A2,2 0 0,0 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11H21V9H19V7A2,2 0 0,0 17,5H15V3H13V5H11V3M8,9H11.5V10.5H8.5V11.25H10.5A1,1 0 0,1 11.5,12.25V14A1,1 0 0,1 10.5,15H8A1,1 0 0,1 7,14V10A1,1 0 0,1 8,9M12.5,9H14V11H15.5V9H17V15H15.5V12.5H12.5M8.5,12.75V13.5H10V12.75" /></svg>';
export const iconConsole =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>console-line</title><path d="M13,19V16H21V19H13M8.5,13L2.47,7H6.71L11.67,11.95C12.25,12.54 12.25,13.5 11.67,14.07L6.74,19H2.5L8.5,13Z" /></svg>';
export const iconOpenInNew =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>open-in-new</title><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" /></svg>';
export const iconHistory =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>history</title><path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" /></svg>';
export const iconBob = '<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" rx="4" transform="matrix(-1 0 0 1 17 0)" fill="#FFDA58"/><circle cx="3.32268" cy="3.32268" r="3.82268" transform="matrix(-1 0 0 1 8.5144 4.03833)" fill="white" stroke="black"/><circle cx="3.32268" cy="3.32268" r="3.82268" transform="matrix(-1 0 0 1 16.0798 4.03833)" fill="white" stroke="black"/></svg>'
