import { NumberSelect } from "@/components/NumberSelect.tsx";
import { toast } from "@/components/Toast";
import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard, getFaviconUrl } from "@/lib/utils.ts";
import { useEffect, useState } from "react";

export function Command() {
	const [search, useSearch] = useMemoryStore("search");
	const [history, setHistory] = useState<
		chrome.history.HistoryItem[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");
	const [maxResults, setMaxResults] = useState<number>(100);

	function loadHistory() {
		browserApi.history.search({ text: search, maxResults }).then((res) => {
			if (!Array.isArray(res)) {
				setLoadingMessage("Failed loading history..");
				return;
			}
			setLoadingMessage("");
			setHistory(res);
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: both are used in loadHistory
	useEffect(() => {
		loadHistory();
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
				<VList onSelect={onSelect} itemHeight={70}>
					{(history || []).map((item) => (
						<VListItem
							className="flex-col"
							data={item}
							key={item.url}
							actions={
								<Actions
									item={item}
									loadHistory={loadHistory}
								></Actions>
							}
						>
							<p className="flex items-center w-full">
								<VListItemIcon
									url={getFaviconUrl(item.url)}
								></VListItemIcon>
								<span>{item.title}</span>
							</p>
							<p className="flex items-center w-full pt-1">
								<span className="text-muted-foreground pl-8 truncate shrink-0">
									{item.visitCount} Visits
								</span>
								<span className="text-muted-foreground pl-4 truncate">
									{item.url}
								</span>
							</p>
						</VListItem>
					))}
				</VList>
			)}
		</>
	);
}

interface ActionsProps {
	loadHistory: () => void;
	item: chrome.history.HistoryItem;
}
function Actions({ item, loadHistory }: ActionsProps) {
	async function deleteUrl() {
		if (!item.url) {
			toast(<span>Item has no url.</span>);
			return;
		}

		await browserApi.history.deleteUrl({ url: item.url });
		toast(<span>Url deleted.</span>);
		loadHistory();
	}

	async function onCopyUrl() {
		if (item.url) {
			await copyTextToClipboard(item.url);
		}
	}
	async function onCopyTitle() {
		if (item.title) {
			await copyTextToClipboard(item.title);
		}
	}

	return (
		<VList>
			{item.url ? (
				<VListItem key={1} onClick={onCopyUrl}>
					Copy url
				</VListItem>
			) : (
				""
			)}
			{item.title ? (
				<VListItem key={2} onClick={onCopyTitle}>
					Copy title
				</VListItem>
			) : (
				""
			)}
			<VListItem onClick={deleteUrl}>
				Delete url (Removes all occurrences)
			</VListItem>
		</VList>
	);
}
