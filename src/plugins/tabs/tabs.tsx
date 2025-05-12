import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard, getFaviconUrl } from "@/lib/utils.ts";
import { closeOtherTabs } from "@/plugins/tabs/utils.ts";
import {
	EyeIcon,
	PinIcon,
	VenetianMaskIcon,
	Volume2Icon,
	VolumeXIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export function Command() {
	const [search, useSearch] = useMemoryStore("search");
	const [tabs, setTabs] = useState<chrome.tabs.Tab[] | undefined>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");

	function searchInTab(search: string, tab: chrome.tabs.Tab) {
		return (
			tab.title?.toLowerCase().includes(search.toLowerCase()) ||
			tab.url?.toLowerCase().includes(search.toLowerCase())
		);
	}

	useEffect(() => {
		browserApi.tabs.query({}).then((res) => {
			if (!Array.isArray(res)) {
				setLoadingMessage("Failed loading top Sites.");
				return;
			}
			setLoadingMessage("");
			setTabs(res);
		});
	}, []);

	async function onSelect(tab: chrome.tabs.Tab) {
		if (tab.id) {
			await browserApi.tabs.update(tab.id, {
				active: true,
				highlighted: true,
			});
		}
	}

	return (
		<>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<VList onSelect={onSelect}>
					{(tabs?.filter((s) => searchInTab(search, s)) || []).map(
						(tab) => (
							<VListItem
								data={tab}
								key={tab.id}
								actions={<Actions {...tab}></Actions>}
							>
								<VListItemIcon
									url={
										tab.favIconUrl || getFaviconUrl(tab.url)
									}
								></VListItemIcon>
								{tab.incognito ? (
									<VListItemIcon>
										<VenetianMaskIcon
											size={20}
										></VenetianMaskIcon>
									</VListItemIcon>
								) : (
									""
								)}
								{tab.audible ? (
									<VListItemIcon>
										<Volume2Icon size={20}></Volume2Icon>
									</VListItemIcon>
								) : (
									""
								)}
								{tab.pinned ? (
									<VListItemIcon>
										<PinIcon size={20}></PinIcon>
									</VListItemIcon>
								) : (
									""
								)}
								{tab.mutedInfo?.muted ? (
									<VListItemIcon>
										<VolumeXIcon size={20}></VolumeXIcon>
									</VListItemIcon>
								) : (
									""
								)}
								{tab.active ? (
									<VListItemIcon>
										<EyeIcon size={20}></EyeIcon>
									</VListItemIcon>
								) : (
									""
								)}
								<span>{tab.title}</span>
								<span className="text-muted-foreground pl-4 truncate">
									{tab.url}
								</span>
							</VListItem>
						),
					)}
				</VList>
			)}
		</>
	);
}

function Actions(tab: chrome.tabs.Tab) {
	async function onCloseOtherTabs() {
		await closeOtherTabs(tab);
	}
	async function onCopyUrl() {
		if (tab.url) {
			await copyTextToClipboard(tab.url);
		}
	}
	async function onCopyTitle() {
		if (tab.title) {
			await copyTextToClipboard(tab.title);
		}
	}

	return (
		<VList>
			{tab.url ? (
				<VListItem key={1} onClick={onCopyUrl}>
					Copy url
				</VListItem>
			) : (
				""
			)}
			{tab.title ? (
				<VListItem key={2} onClick={onCopyTitle}>
					Copy title
				</VListItem>
			) : (
				""
			)}
			<VListItem onClick={onCloseOtherTabs}>Close other tabs</VListItem>
		</VList>
	);
}
