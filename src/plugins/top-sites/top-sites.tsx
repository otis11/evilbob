import { browserApi } from "@/browser-api.ts";
import { VList, VListItem } from "@/components/VList.tsx";
import type { PluginViewProps } from "@/plugins";
import { useEffect, useState } from "react";

export function Command({ search }: PluginViewProps) {
	const [topSites, setTopSites] = useState<
		chrome.topSites.MostVisitedURL[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");

	function searchInTopSite(
		search: string,
		site: chrome.topSites.MostVisitedURL,
	) {
		return (
			site.title.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
			site.url.toLowerCase().indexOf(search.toLowerCase()) > -1
		);
	}

	useEffect(() => {
		browserApi.topSites.get().then((res) => {
			if (!Array.isArray(res)) {
				setLoadingMessage("Failed loading top Sites.");
				return;
			}
			setLoadingMessage("");
			setTopSites(res);
		});
	}, []);

	async function onSelect(site: chrome.topSites.MostVisitedURL) {
		await browserApi.tabs.create({ url: site.url });
	}

	return (
		<>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<VList onSelect={onSelect}>
					{(
						topSites?.filter((s) => searchInTopSite(search, s)) ||
						[]
					).map((site) => (
						<VListItem data={site} key={site.url}>
							<span>{site.title}</span>
							<span className="text-muted-foreground pl-4 truncate">
								{site.url}
							</span>
						</VListItem>
					))}
				</VList>
			)}
		</>
	);
}
