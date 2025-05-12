import type {
	BookmarkFolder,
	BookmarkItem,
} from "@/plugins/bookmarks/bookmarks.tsx";

export function flattenBookmarksTree(
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
			results.push(...flattenBookmarksTree(item.children, childFolders));
			continue;
		}

		results.push({
			node: item,
			folders,
		});
	}
	return results;
}
