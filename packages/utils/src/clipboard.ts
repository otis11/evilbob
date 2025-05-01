export interface CopyToClipboardProps {
	"image/png": Blob;
	"image/jpeg": Blob;
	"image/gif": Blob;
	"text/plain": string;
}

export async function copyTextToClipboard(text: string) {
	const type = "text/plain";
	const clipboardItemData = {
		[type]: text,
	};
	const clipboardItem = new ClipboardItem(clipboardItemData);
	await navigator.clipboard.write([clipboardItem]);
}

export async function copyImageToClipboard(url: string) {
	const data = await fetch(url);
	const blob = await data.blob();
	await navigator.clipboard.write([
		new ClipboardItem({
			[blob.type]: blob,
		}),
	]);
}

export async function getClipboard() {
	return await navigator.clipboard.read();
}
