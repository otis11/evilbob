import { type BobWindowState, defineBobPlugin } from "../../core/BobPlugin.ts";
import { Result } from "../../core/components/result/result.ts";
import { NewUrlResult } from "../../core/components/result/simpe-result.ts";
import { Search } from "../../core/components/search.ts";
import { iconFromString, iconYoutube } from "../../core/icons.ts";
import { focusLastActiveWindow } from "../../core/util/last-active-window.ts";

export default defineBobPlugin({
	name: () => "Youtube",
	description: () =>
		"Youtube search and Youtube shortcuts, for instance Youtube History.",
	prefix: "yt",
	icon: iconYoutube,
	async provideResults(): Promise<Result[]> {
		return [
			NewUrlResult({
				title: "Youtube History",
				url: "https://www.youtube.com/feed/history",
			}),
			NewUrlResult({
				title: "Youtube Playlists",
				url: "https://www.youtube.com/feed/playlists",
			}),
			NewUrlResult({
				title: "Youtube Watch Later",
				url: "https://www.youtube.com/playlist?list=WL",
			}),
			NewUrlResult({
				title: "Youtube Subscriptions",
				url: "https://www.youtube.com/feed/subscriptions",
			}),
			new YoutubeSearch(),
		];
	},
});

export class YoutubeSearch extends Result {
	public id(): string {
		return this.className() + this.title();
	}

	public search(search: Search) {
		return this.makeFakeSearch(
			new Search({
				selectionStart: 0,
				text: "",
			}),
			search.text.length > 0 ? search.minMatchScore + 1 : 0,
		);
	}

	title(): string {
		return "Youtube";
	}

	description(): string {
		return "Search Youtube";
	}

	prepend(): HTMLElement | undefined {
		return iconFromString(iconYoutube);
	}

	async run(state: BobWindowState): Promise<void> {
		const query =
			state.currentSearch.words()[0] === "yt"
				? state.currentSearch.text.slice(2).trim()
				: state.currentSearch.text;
		await chrome.tabs.create({
			url: `https://www.youtube.com/results?search_query=${query.replaceAll(" ", "+")}`,
		});
		await focusLastActiveWindow();
	}
}
