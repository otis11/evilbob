import { browserApi } from "@/browser-api.ts";
import { NumberSelect } from "@/components/NumberSelect.tsx";
import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { getFaviconUrl } from "@/lib/utils.ts";
import type { PluginViewProps } from "@/plugins";
import { useEffect, useState } from "react";

export function Command({ search }: PluginViewProps) {
	const [history, setHistory] = useState<
		chrome.history.HistoryItem[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");
	const [maxResults, setMaxResults] = useState<number>(100);

	useEffect(() => {
		let isMounted = true;
		browserApi.history.search({ text: search, maxResults }).then((res) => {
			if (!isMounted) {
				return;
			}
			if (!Array.isArray(res)) {
				setLoadingMessage("Failed loading history..");
				return;
			}
			setLoadingMessage("");
			setHistory(res);
		});
		return () => {
			isMounted = false;
		};
	}, [search, maxResults]);

	async function onSelect(site: chrome.topSites.MostVisitedURL) {
		await browserApi.tabs.create({ url: site.url });
	}

	return (
		<>
			<div className="flex py-4">
				<div className="mr-auto"></div>
				<NumberSelect
					value={maxResults}
					values={[50, 100, 250, 500]}
					onValueChange={setMaxResults}
				></NumberSelect>
			</div>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<VList onSelect={onSelect}>
					{(history || []).map((site) => (
						<VListItem data={site} key={site.url}>
							<VListItemIcon
								url={getFaviconUrl(site.url)}
							></VListItemIcon>
							<span>{site.title}</span>
							<span className="text-muted-foreground pl-4 truncate shrink-0">
								{site.visitCount} Visits
							</span>
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
