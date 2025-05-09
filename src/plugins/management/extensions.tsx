import { toast } from "@/components/Toast.tsx";
import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { CheckIcon, PenOffIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function Command() {
	const [search, useSearch] = useMemoryStore("search");
	const [extensions, setExtensions] = useState<
		chrome.management.ExtensionInfo[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("loading...");

	function searchInExtension(
		search: string,
		extension: chrome.management.ExtensionInfo,
	) {
		return (
			extension.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
			extension.description.toLowerCase().indexOf(search.toLowerCase()) >
				-1
		);
	}

	useEffect(() => {
		browserApi.management.getAll().then((res) => {
			if (!Array.isArray(res)) {
				setLoadingMessage("Failed loading extensions.");
				return;
			}
			setLoadingMessage("");
			setExtensions(res);
		});
	}, []);

	async function onSelect(extension: chrome.management.ExtensionInfo) {
		const url = extension.homepageUrl || extension.optionsUrl;
		if (url) {
			await browserApi.tabs.create({ url });
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
					{(
						extensions?.filter((s) =>
							searchInExtension(search, s),
						) || []
					).map((extension) => (
						<VListItem
							data={extension}
							key={extension.id}
							actions={<Actions {...extension}></Actions>}
						>
							<VListItemIcon
								url={extension.icons?.[0]?.url}
							></VListItemIcon>
							{extension.enabled ? (
								<VListItemIcon>
									<CheckIcon
										className="text-green-400"
										size={20}
									></CheckIcon>
								</VListItemIcon>
							) : (
								""
							)}
							{!extension.mayDisable ? (
								<VListItemIcon>
									<PenOffIcon
										className="text-destructive"
										size={20}
									></PenOffIcon>
								</VListItemIcon>
							) : (
								""
							)}
							<span>{extension.name}</span>
							<span className="text-muted-foreground pl-4 truncate">
								{extension.description}
							</span>
							<span className="text-muted-foreground pl-4 truncate">
								Permissions: {extension.permissions.join(", ")}
							</span>
						</VListItem>
					))}
				</VList>
			)}
		</>
	);
}

function Actions(extension: chrome.management.ExtensionInfo) {
	async function uninstall() {
		await browserApi.management.uninstall({ id: extension.id });
		toast(<span>Extension uninstalled.</span>);
	}

	return (
		<VList>
			<VListItem onClick={uninstall}>Uninstall</VListItem>
		</VList>
	);
}
