import { toast } from "@/components/Toast.tsx";
import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { getFaviconUrl } from "@/lib/utils.ts";
import { useEffect, useState } from "react";

export interface BookmarkFolder {
	id: string;
	title: string;
}

export interface BookmarkItem {
	node: chrome.bookmarks.BookmarkTreeNode;
	folders: BookmarkFolder[];
}

export function Command() {
	const [search, useSearch] = useMemoryStore("search");
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: flattenBookmarksTree is not needed as a dependency
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
				<VList onSelect={onBookmarkClick}>
					{(
						bookmarks?.filter((b) => searchInBookmark(search, b)) ||
						[]
					).map((item) => (
						<VListItem
							data={item}
							key={item.node.id}
							actions={<Actions {...item}></Actions>}
						>
							<VListItemIcon
								url={getFaviconUrl(item.node.url)}
							></VListItemIcon>
							<span>{item.node.title}</span>
							<span className="text-muted-foreground pl-4 truncate">
								{item.node.url}
							</span>
							<span className="text-muted-foreground pl-4">
								{item.folders.map((f) => f.title).join("/")}
							</span>
						</VListItem>
					))}
				</VList>
			)}
		</>
	);
}

function Actions(bookmark: BookmarkItem) {
	async function removeBookmark() {
		await browserApi.bookmarks.remove(bookmark.node.id);
		toast("Removed.");
	}
	return (
		<VList>
			<VListItem onClick={removeBookmark}>Remove</VListItem>
		</VList>
	);
}
