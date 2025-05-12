import { toast } from "@/components/Toast.tsx";
import { VList, VListItem } from "@/components/VList.tsx";
import { browserApi, getCurrentTab } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import {
	copyTextToClipboard,
	formatTimeFuture,
	getDomainWithoutSubdomains,
} from "@/lib/utils.ts";
import { useEffect, useState } from "react";
interface Color {
	c: string;
	title: string;
}

export function Command() {
	const [search, useSearch] = useMemoryStore("search");

	const [cookies, setCookies] = useState<
		chrome.cookies.Cookie[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");

	function searchInCookie(s: string, cookie: chrome.cookies.Cookie) {
		return (
			cookie.name.toLowerCase().includes(s.toLowerCase()) ||
			cookie.domain.toLowerCase().includes(s.toLowerCase()) ||
			cookie.value.toLowerCase().includes(s.toLowerCase())
		);
	}

	useEffect(() => {
		(async () => {
			const currentTab = await getCurrentTab();
			if (!currentTab?.url) {
				setLoadingMessage("Tab not found.");
				setCookies([]);
				return;
			}
			const cookies = await browserApi.cookies.getAll({
				domain: getDomainWithoutSubdomains(currentTab.url),
			});

			if (cookies.length === 0) {
				setLoadingMessage("No cookies found.");
				setCookies([]);
				return;
			}
			setCookies(cookies);
			setLoadingMessage("");
		})();
	}, []);

	return (
		<>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<VList itemHeight={80}>
					{(
						cookies?.filter((color) =>
							searchInCookie(search, color),
						) || []
					).map((cookie, index) => (
						<VListItem
							key={cookie.name}
							actions={<Actions {...cookie}></Actions>}
						>
							<div className="flex flex-col w-full pr-4 truncate">
								<span className="m-auto p-1 flex gap-4 items-center truncate justify-start w-full">
									<span>{cookie.name}</span>
									<span className="text-muted-foreground">
										{cookie.domain}
									</span>
									{cookie.secure ? (
										<span className="text-muted-foreground text-xs">
											secure
										</span>
									) : (
										""
									)}
									{cookie.httpOnly ? (
										<span className="text-muted-foreground text-xs">
											httpOnly
										</span>
									) : (
										""
									)}
									{cookie.hostOnly ? (
										<span className="text-muted-foreground text-xs">
											hostOnly
										</span>
									) : (
										""
									)}
								</span>
								<span className="text-muted-foreground truncate justify-start flex items-center">
									{cookie.value}
								</span>
							</div>
							<div className="shrink-0 flex align-center gap-4 ml-auto">
								<span className="text-muted-foreground">
									{cookie.session
										? "Session"
										: formatTimeFuture(
												cookie.expirationDate
													? cookie.expirationDate *
															1000
													: undefined,
											)}
								</span>
							</div>
						</VListItem>
					))}
				</VList>
			)}
		</>
	);
}

function Actions(cookie: chrome.cookies.Cookie) {
	async function removeCookie() {
		const currentTab = await getCurrentTab();
		if (currentTab?.url) {
			await browserApi.cookies.remove({
				url: currentTab.url,
				name: cookie.name,
			});
			toast("Removed.");
		}
	}
	return (
		<VList>
			<VListItem
				key={2}
				onClick={() => copyTextToClipboard(cookie.value)}
			>
				Copy value
			</VListItem>
			<VListItem key={3} onClick={() => copyTextToClipboard(cookie.name)}>
				Copy name
			</VListItem>
			<VListItem key={1} onClick={removeCookie}>
				Remove
			</VListItem>
		</VList>
	);
}
