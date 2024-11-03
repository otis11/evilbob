const loadingElement = document.getElementById("loading");
export function setLoading(isLoading = false) {
	if (isLoading) {
		loadingElement?.classList.remove("hidden");
	} else {
		loadingElement?.classList.add("hidden");
	}
}
