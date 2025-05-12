import { toast } from "@/components/Toast.tsx";
import { VList, VListItem, VListItemIcon } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { browserApi } from "@/lib/browser-api.ts";
import { memoryStore, useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard, getFaviconUrl } from "@/lib/utils.ts";
import { flattenBookmarksTree } from "@/plugins/bookmarks/utils.ts";
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
					loadBookmarks={loadBookmarks}
					newUrl={editUrl}
					newTitle={editTitle}
					id={editBookmark.node.id}
					setEditBookmark={setEditBookmark}
				></EditActions>,
			);
		}
	}, [editTitle, editUrl, editBookmark]);

	useEffect(() => {
		loadBookmarks();
	}, []);

	function loadBookmarks() {
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
	}

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
					loadBookmarks={loadBookmarks}
				></EditBookmark>
			) : (
				<BookmarksList
					loadBookmarks={loadBookmarks}
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
	loadBookmarks: () => void;
}
function Actions({ bookmark, setEditBookmark, loadBookmarks }: ActionsProps) {
	async function removeBookmark() {
		await browserApi.bookmarks.remove(bookmark.node.id);
		toast("Removed.");
		loadBookmarks();
	}

	function editBookmark() {
		setEditBookmark(bookmark);
	}

	async function onCopyUrl() {
		if (bookmark.node.url) {
			await copyTextToClipboard(bookmark.node.url);
		}
	}

	async function onCopyTitle() {
		await copyTextToClipboard(bookmark.node.title);
	}

	return (
		<VList>
			<VListItem key={2} onClick={editBookmark}>
				Edit
			</VListItem>
			<VListItem key={3} onClick={onCopyTitle}>
				Copy title
			</VListItem>
			<VListItem key={4} onClick={onCopyUrl}>
				Copy url
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
	loadBookmarks: () => void;
}
function BookmarksList({
	bookmarks,
	search,
	setEditBookmark,
	loadBookmarks,
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
								loadBookmarks={loadBookmarks}
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
	loadBookmarks: () => void;
}
function EditBookmark({
	id,
	setEditBookmark,
	title,
	url,
	setTitle,
	setUrl,
	loadBookmarks,
}: EditBookmarkProps) {
	function onEditCancel() {
		setEditBookmark(undefined);
	}

	async function onEditSave() {
		await browserApi.bookmarks.update(id, { title, url });
		toast("Bookmark updated.");
		setEditBookmark(undefined);
		loadBookmarks();
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
	loadBookmarks: () => void;
}
function EditActions({
	setEditBookmark,
	newTitle,
	newUrl,
	id,
	loadBookmarks,
}: EditActionsProps) {
	function onEditCancel() {
		setEditBookmark(undefined);
	}

	async function onEditSave() {
		await browserApi.bookmarks.update(id, { title: newTitle, url: newUrl });
		toast("Bookmark updated.");
		setEditBookmark(undefined);
		loadBookmarks();
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
