import { toast } from "@/components/Toast.tsx";
import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { browserApi } from "@/lib/browser-api.ts";
import { memoryStore, useMemoryStore } from "@/lib/memory-store.ts";
import { getFaviconUrl } from "@/lib/utils.ts";
import { Label } from "@radix-ui/react-label";
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
	const [editTitle, setEditTitle] = useState<string>("");
	const [editUrl, setEditUrl] = useState<string>("");
	const [editBookmark, setEditBookmark] = useState<
		BookmarkItem | undefined
	>();
	const [bookmarksLoadingMessage, setBookmarksLoadingMessage] =
		useState("loading...");

	function setBookmarkToEdit(bookmark: BookmarkItem | undefined) {
		setEditBookmark(bookmark);
		setEditUrl(bookmark?.node.url || "");
		setEditTitle(bookmark?.node.title || "");
	}

	useEffect(() => {
		if (editBookmark) {
			memoryStore.set(
				"actions",
				<EditActions
					newUrl={editUrl}
					newTitle={editTitle}
					id={editBookmark.node.id}
					setEditBookmark={setEditBookmark}
				></EditActions>,
			);
		}
	}, [editTitle, editUrl, editBookmark]);

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
			) : editBookmark ? (
				<EditBookmark
					setEditBookmark={setBookmarkToEdit}
					title={editTitle}
					url={editUrl}
					setTitle={setEditTitle}
					setUrl={setEditUrl}
					id={editBookmark.node.id}
				></EditBookmark>
			) : (
				<BookmarksList
					bookmarks={bookmarks}
					setEditBookmark={setBookmarkToEdit}
					search={search}
				></BookmarksList>
			)}
		</>
	);
}

interface ActionsProps {
	bookmark: BookmarkItem;
	setEditBookmark: (item: BookmarkItem | undefined) => void;
}
function Actions({ bookmark, setEditBookmark }: ActionsProps) {
	async function removeBookmark() {
		await browserApi.bookmarks.remove(bookmark.node.id);
		toast("Removed.");
	}

	function editBookmark() {
		setEditBookmark(bookmark);
	}
	return (
		<VList>
			<VListItem key={2} onClick={editBookmark}>
				Edit
			</VListItem>
			<VListItem key={1} onClick={removeBookmark}>
				Remove
			</VListItem>
		</VList>
	);
}

interface BookmarksListProps {
	bookmarks: BookmarkItem[] | undefined;
	search: string;
	setEditBookmark: (item: BookmarkItem | undefined) => void;
}
function BookmarksList({
	bookmarks,
	search,
	setEditBookmark,
}: BookmarksListProps) {
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
	return (
		<VList onSelect={onBookmarkClick} itemHeight={60}>
			{(bookmarks?.filter((b) => searchInBookmark(search, b)) || []).map(
				(item) => (
					<VListItem
						className="flex-col"
						data={item}
						key={item.node.id}
						actions={
							<Actions
								bookmark={item}
								setEditBookmark={setEditBookmark}
							></Actions>
						}
					>
						<span className="w-full flex items-center">
							<VListItemIcon
								url={getFaviconUrl(item.node.url)}
							></VListItemIcon>
							<span>{item.node.title}</span>
							<span className="text-muted-foreground ml-auto">
								{item.folders.map((f) => f.title).join("/")}
							</span>
						</span>
						<span className="w-full flex items-center pt-1">
							<span className="text-muted-foreground truncate">
								{item.node.url}
							</span>
						</span>
					</VListItem>
				),
			)}
		</VList>
	);
}

interface EditBookmarkProps {
	setEditBookmark: (item: BookmarkItem | undefined) => void;
	title: string;
	url: string;
	setTitle: (newTitle: string) => void;
	setUrl: (newUrl: string) => void;
	id: string;
}
function EditBookmark({
	id,
	setEditBookmark,
	title,
	url,
	setTitle,
	setUrl,
}: EditBookmarkProps) {
	function onEditCancel() {
		setEditBookmark(undefined);
	}

	async function onEditSave() {
		await browserApi.bookmarks.update(id, { title, url });
		toast("Bookmark updated.");
		setEditBookmark(undefined);
	}

	return (
		<>
			<h3 className="pb-2 text-base">Edit Bookmark</h3>
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="title">Title</Label>
				<Input
					value={title}
					id="title"
					onChange={(e) => setTitle(e.target.value)}
				></Input>
			</div>
			<div className="grid w-full max-w-sm items-center gap-1.5">
				<Label htmlFor="url">Url</Label>
				<Input
					value={url}
					id="url"
					onChange={(e) => setUrl(e.target.value)}
				></Input>
			</div>

			<div className="flex items-center pt-4">
				<Button onClick={onEditCancel}>Cancel</Button>
				<Button onClick={onEditSave} className="ml-auto">
					Save
				</Button>
			</div>
		</>
	);
}

interface EditActionsProps {
	setEditBookmark: (item: BookmarkItem | undefined) => void;
	newTitle: string;
	newUrl: string;
	id: string;
}
function EditActions({
	setEditBookmark,
	newTitle,
	newUrl,
	id,
}: EditActionsProps) {
	function onEditCancel() {
		setEditBookmark(undefined);
	}

	async function onEditSave() {
		await browserApi.bookmarks.update(id, { title: newTitle, url: newUrl });
		toast("Bookmark updated.");
		setEditBookmark(undefined);
	}
	return (
		<VList>
			<VListItem key={2} onClick={onEditSave}>
				Save
			</VListItem>
			<VListItem key={1} onClick={onEditCancel}>
				Cancel
			</VListItem>
		</VList>
	);
}
