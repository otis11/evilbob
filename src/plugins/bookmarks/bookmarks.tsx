import { browserApi } from "@/browser-api.ts";
import { VList, VListItem } from "@/components/VList.tsx";
import type { PluginViewProps } from "@/plugins";
import { useEffect, useState } from "react";

export interface BookmarkFolder {
	id: string;
	title: string;
}

export interface BookmarkItem {
	node: chrome.bookmarks.BookmarkTreeNode;
	folders: BookmarkFolder[];
}

export function Command({ search }: PluginViewProps) {
	const [bookmarks, setBookmarks] = useState<BookmarkItem[] | undefined>();
	const [bookmarksLoadingMessage, setBookmarksLoadingMessage] =
		useState("loading...");

	function flattenBookmarksTree(
		tree: chrome.bookmarks.BookmarkTreeNode[],
		folders: BookmarkFolder[],
	) {
		const results: BookmarkItem[] = [];
		for (const item of tree) {
			if (item.children) {
				const childFolders: BookmarkFolder[] = [
					...folders,
					{ title: item.title, id: item.id },
				];
				results.push(
					...flattenBookmarksTree(item.children, childFolders),
				);
				continue;
			}

			results.push({
				node: item,
				folders,
			});
		}
		return results;
	}

	async function onBookmarkClick(item: BookmarkItem) {
		if (item.node.url) {
			await browserApi.tabs.create({ url: item.node.url });
		}
	}

	function searchInBookmark(s: string, item: BookmarkItem) {
		return (
			item.node.title.toLowerCase().includes(s.toLowerCase()) ||
			item.node.url?.toLowerCase().includes(s.toLowerCase())
		);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: TODO fix ignore
	useEffect(() => {
		browserApi.bookmarks.getTree().then((res) => {
			if (!Array.isArray(res)) {
				setBookmarksLoadingMessage("Failed loading bookmarks.");
				return;
			}
			setBookmarksLoadingMessage("");
			const bookmarksFlat = flattenBookmarksTree(res, []);
			if (bookmarksFlat.length === 0) {
				setBookmarksLoadingMessage("No bookmarks found.");
			}
			setBookmarks(bookmarksFlat);
		});
	}, []);
	return (
		<>
			{bookmarksLoadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{bookmarksLoadingMessage}
				</div>
			) : (
				<VList itemWidth={-1} itemHeight={32}>
					{(
						bookmarks?.filter((b) => searchInBookmark(search, b)) ||
						[]
					).map((item) => (
						<VListItem
							key={item.node.id}
							onClick={() => onBookmarkClick(item)}
						>
							<span>{item.node.title}</span>
							<span className="text-fg-weak pl-4 truncate">
								{item.node.url}
							</span>
							<span className="text-fg-weak pl-4 font-bold">
								{item.folders.map((f) => f.title).join("/")}
							</span>
						</VListItem>
					))}
				</VList>
			)}
		</>
	);
}
