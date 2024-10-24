import { getEnabledResultGroups } from ".";
import { iconFilter, iconFromString } from "../../icons";
import { ResultGroup } from "../result-group";
import { Result } from "../result/result";
import type { Search } from "../search";

export class ResultGroupPrefixes extends ResultGroup {
	prefix = "?";
	description = "Filter for a specific ResultGroup only.";

	public async getResults(): Promise<Result[]> {
		const groups = await getEnabledResultGroups();
		const results = [];
		for (const group of groups) {
			if (group.prefix) {
				results.push(
					new ResultPrefix(
						group.prefix,
						`Filter for ${group.nameHumanReadable}`,
					),
				);
			}
		}
		return results;
	}
}

export class ResultPrefix extends Result {
	constructor(title: string, description: string) {
		super({
			title,
			description,
			prepend: iconFromString(iconFilter),
		});
	}

	public id(): string {
		return this.name() + this.title;
	}

	async execute(search: Search): Promise<void> {
		if (search.inputElement) {
			search.inputElement.value = this.title;
			search.inputElement.scrollIntoView();
			search.inputElement.focus();
		}
	}
}
