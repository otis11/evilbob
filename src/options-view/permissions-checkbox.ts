export type PermissionsCheckboxConfig = {
	permissions: string[];
	origins: string[];
	title: string;
};

export class PermissionsCheckbox {
	el: HTMLElement;

	constructor(config: PermissionsCheckboxConfig) {
		this.el = document.createElement("label");
		this.el.innerText = config.title;
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		chrome.permissions.contains(
			{
				permissions: config.permissions,
				origins: config.origins,
			},
			(result) => {
				checkbox.checked = !!result;
			},
		);
		checkbox.addEventListener("change", () => {
			if (checkbox.checked) {
				chrome.permissions.request(
					{
						permissions: config.permissions,
						origins: config.origins,
					},
					(granted) => {
						if (granted) {
							checkbox.checked = true;
						} else {
							console.log("cannot acesss?", granted);
						}
					},
				);
			} else {
				chrome.permissions.remove(
					{
						permissions: config.permissions,
						origins: config.origins,
					},
					(removed) => {
						if (removed) {
							checkbox.checked = false;
						} else {
							console.log("cannot remove?", removed);
						}
					},
				);
			}
		});
		this.el.append(checkbox);
	}
}
