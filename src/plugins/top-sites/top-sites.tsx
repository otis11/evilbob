import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard, getFaviconUrl } from "@/lib/utils.ts";
import { useEffect, useState } from "react";

export function Command() {
	const [search, useSearch] = useMemoryStore("search");
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
						<VListItem
							data={site}
							key={site.url}
							actions={<Actions {...site}></Actions>}
						>
							<VListItemIcon
								url={getFaviconUrl(site.url)}
							></VListItemIcon>
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

function Actions(site: chrome.topSites.MostVisitedURL) {
	return (
		<VList>
			<VListItem key={1} onClick={() => copyTextToClipboard(site.url)}>
				Copy url
			</VListItem>
			<VListItem key={2} onClick={() => copyTextToClipboard(site.title)}>
				Copy title
			</VListItem>
		</VList>
	);
}
