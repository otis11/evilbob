import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard } from "@/lib/utils.ts";
import { CheckCheckIcon, CircleOffIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

type DownloadItemWithIcon = chrome.downloads.DownloadItem & { icon: string };
export function Command() {
	const [search, useSearch] = useMemoryStore("search");

	const [downloads, setDownloads] = useState<
		DownloadItemWithIcon[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");

	function searchInDownload(
		s: string,
		downloadItem: chrome.downloads.DownloadItem,
	) {
		return (
			downloadItem.url.toLowerCase().includes(s.toLowerCase()) ||
			downloadItem.filename.toLowerCase().includes(s.toLowerCase())
		);
	}

	useEffect(() => {
		browserApi.downloads.search({}).then(async (res) => {
			if (res.length === 0) {
				setLoadingMessage("No downloads found.");
				setDownloads([]);
				return;
			}
			const downloadsWithIcons: DownloadItemWithIcon[] = [];
			for (const download of res) {
				const icon = await browserApi.downloads.getFileIcon(
					download.id,
				);
				downloadsWithIcons.push({
					...download,
					icon,
				});
			}
			setDownloads(downloadsWithIcons);
			setLoadingMessage("");
		});
	}, []);

	async function onSelect(item: DownloadItemWithIcon) {
		await browserApi.downloads.show(item.id);
	}

	return (
		<>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<VList itemHeight={80} onSelect={onSelect}>
					{(
						downloads?.filter((color) =>
							searchInDownload(search, color),
						) || []
					).map((item, index) => (
						<VListItem
							data={item}
							key={item.id}
							actions={<Actions {...item}></Actions>}
						>
							<VListItemIcon url={item.icon}></VListItemIcon>
							<div className="flex flex-col w-full truncate">
								<span className="pb-1 flex items-center">
									<span className="pr-2 truncate">
										{item.filename} {item.icon}
									</span>
									<div className="shrink-0 mr-4 flex align-center gap-4 ml-auto">
										{item.state === "complete" ? (
											<CheckCheckIcon
												size={20}
											></CheckCheckIcon>
										) : (
											""
										)}
										{item.state === "interrupted" ? (
											<CircleOffIcon
												size={20}
											></CircleOffIcon>
										) : (
											""
										)}
										{item.state === "in_progress" ? (
											<LoaderCircleIcon
												size={20}
												className="animate-spin"
											></LoaderCircleIcon>
										) : (
											""
										)}
									</div>
								</span>
								<span className="text-muted-foreground truncate">
									{item.url}
								</span>
							</div>
						</VListItem>
					))}
				</VList>
			)}
		</>
	);
}

function Actions(item: chrome.downloads.DownloadItem) {
	async function removeFile() {
		await browserApi.downloads.removeFile(item.id);
	}

	async function eraseDownload() {
		await browserApi.downloads.erase({ id: item.id });
	}

	return (
		<VList>
			<VListItem
				key="copyFilename"
				onClick={() => copyTextToClipboard(item.filename)}
			>
				Copy filename
			</VListItem>
			<VListItem
				key="copyUrl"
				onClick={() => copyTextToClipboard(item.url)}
			>
				Copy url
			</VListItem>
			<VListItem key="removeFile" onClick={removeFile}>
				Remove
			</VListItem>
			<VListItem key="eraseDownload" onClick={eraseDownload}>
				Erase
			</VListItem>
		</VList>
	);
}
