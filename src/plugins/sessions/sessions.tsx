import { VList, VListItem } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { isChromium } from "@/lib/platform";
import { formatTimeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Command() {
	const [search, useSearch] = useMemoryStore("search");
	const [sessions, setSessions] = useState<
		chrome.sessions.Session[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");

	function searchInSession(search: string, session: chrome.sessions.Session) {
		if (session.window) {
			let found = false;
			for (const tab of session.window.tabs || []) {
				if (tab.url?.includes(search.toLowerCase())) {
					found = true;
				}
				if (tab.title?.includes(search.toLowerCase())) {
					found = true;
				}
			}
			return found;
		}
		if (session.tab) {
			let found = false;
			if (session.tab.url?.includes(search.toLowerCase())) {
				found = true;
			}
			if (session.tab.title?.includes(search.toLowerCase())) {
				found = true;
			}
			return found;
		}
		return true;
	}

	useEffect(() => {
		// max value of maxresults can be 25
		browserApi.sessions
			.getRecentlyClosed({ maxResults: 25 })
			.then((res) => {
				if (!Array.isArray(res)) {
					setLoadingMessage("Failed loading sessions.");
					return;
				}
				if (res.length === 0) {
					setLoadingMessage("No sessions found.");
					setSessions(res);
					return;
				}
				setLoadingMessage("");
				setSessions(res);
			});
	}, []);

	async function onSelect(session: chrome.sessions.Session) {
		const sessionId = session.window
			? session.window.sessionId
			: session.tab
				? session.tab.sessionId
				: undefined;
		if (sessionId) {
			await browserApi.sessions.restore(sessionId);
		}
	}

	return (
		<>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<VList itemHeight={60} onSelect={onSelect}>
					{(
						sessions?.filter((s) => searchInSession(search, s)) ||
						[]
					).map((session) => {
						// https://groups.google.com/a/chromium.org/g/chromium-extensions/c/DRAM49zGIfo
						const timeAgoString = formatTimeAgo(
							isChromium
								? session.lastModified * 1000
								: session.lastModified,
						);
						if (session.window) {
							return (
								<VListItem
									className="flex-col"
									data={session}
									key={session.window.sessionId}
								>
									<span className="flex items-center justify-start w-full">
										<span>{timeAgoString}</span>
										<span className="text-muted-foreground text-sm pl-4">
											{session.window.sessionId}
										</span>
										<span className="text-muted-foreground text-sm ml-auto">
											{session.window.tabs?.length || 0}{" "}
											Tabs
										</span>
									</span>
									<span className="flex items-center justify-start w-full gap-4 pt-1">
										{session.window.tabs?.map((tab) => (
											<span
												key={tab.id}
												className="max-w-56 truncate text-muted-foreground text-sm"
											>
												{tab.title || tab.url}
											</span>
										))}
									</span>
								</VListItem>
							);
						}
						if (session.tab) {
							return (
								<VListItem
									className="flex-col"
									data={session}
									key={session.tab.sessionId}
								>
									<span className="flex items-center justify-start w-full">
										<span>{timeAgoString}</span>
										<span className="text-muted-foreground text-sm pl-4">
											{session.tab.sessionId}
										</span>
									</span>
									<span className="flex items-center justify-start w-full pt-1">
										<span className="text-muted-foreground text-sm truncate">
											{session.tab.title ||
												session.tab.url}
										</span>
									</span>
								</VListItem>
							);
						}
						return "";
					})}
				</VList>
			)}
		</>
	);
}
