export class Icon {
	static fromString(html: string) {
		const span = document.createElement("span");
		span.classList.add("icon");
		span.innerHTML = html;
		return span;
	}

	static fromUrl(url: string | undefined, fallbackIcon: string) {
		if (!url) {
			return Icon.fromString(fallbackIcon);
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
			img.outerHTML = Icon.fromString(fallbackIcon).outerHTML;
		};
		span.append(img);
		return span;
	}
}
