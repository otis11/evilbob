import { browserApi, getCurrentTab } from "@/browser-api.ts";
import { toast } from "@/components/Toast.tsx";
import { VList, VListItem } from "@/components/VList.tsx";
import { formatTimeFuture, getDomainWithoutSubdomains } from "@/lib/utils.ts";
import type { PluginViewProps } from "@/plugins";
import { LockIcon, PenOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
interface Color {
	c: string;
	title: string;
}

export function Command({ search }: PluginViewProps) {
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
							<div className="flex flex-col w-full pr-4">
								<span className="m-auto p-1 flex gap-4 items-center justify-start w-full">
									<span>{cookie.name}</span>
								</span>
								<span className="text-muted-foreground truncate w-full justify-start flex items-center">
									{cookie.domain}
								</span>
							</div>
							<div className="shrink-0 flex align-center gap-4 ml-auto">
								{cookie.secure ? (
									<LockIcon size={20}></LockIcon>
								) : (
									""
								)}
								{cookie.httpOnly ? (
									<PenOffIcon size={20}></PenOffIcon>
								) : (
									""
								)}
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
			<VListItem onClick={removeCookie}>Remove</VListItem>
		</VList>
	);
}
