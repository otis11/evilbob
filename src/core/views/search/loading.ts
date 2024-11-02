const laodingElement = document.getElementById("loading");
export function setLoading(isLoading = false) {
	if (isLoading) {
		laodingElement?.classList.remove("hidden");
	} else {
		laodingElement?.classList.add("hidden");
	}
}
