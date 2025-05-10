import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
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

	return (
		<>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<VList itemHeight={80}>
					{(
						downloads?.filter((color) =>
							searchInDownload(search, color),
						) || []
					).map((item, index) => (
						<VListItem
							key={item.id}
							actions={<Actions {...item}></Actions>}
						>
							<VListItemIcon url={item.icon}></VListItemIcon>
							<div className="flex flex-col w-full truncate">
								<span className="m-auto p-1">
									<div className="shrink-0 mr-4 flex align-center gap-4">
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
									{item.filename} {item.icon}
								</span>
								<span className="text-muted-foreground pl-4 truncate">
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
	async function showInExplorer() {
		await browserApi.downloads.show(item.id);
	}

	async function removeFile() {
		await browserApi.downloads.removeFile(item.id);
	}

	async function eraseDownload() {
		await browserApi.downloads.erase({ id: item.id });
	}

	return (
		<VList>
			<VListItem key="removeFile" onClick={removeFile}>
				Remove
			</VListItem>
			<VListItem key="eraseDownload" onClick={eraseDownload}>
				Erase
			</VListItem>
			<VListItem key="showInExplorer" onClick={showInExplorer}>
				Show in Explorer
			</VListItem>
		</VList>
	);
}
