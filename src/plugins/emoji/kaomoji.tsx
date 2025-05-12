import { toast } from "@/components/Toast.tsx";
import { VList, VListItemTile } from "@/components/VList.tsx";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard } from "@/lib/utils.ts";
import { KAOMOJI, type KaomojiCategory } from "./data";

export function Command() {
	const [search, setSearch] = useMemoryStore("search");

	async function onSelect(kaomoji: string) {
		await copyTextToClipboard(kaomoji);
		toast("Copied.");
	}

	function searchInKaomoji(s: string, kaomojiCategory: KaomojiCategory) {
		const lower = s.toLowerCase();
		return (
			kaomojiCategory.description.toLowerCase().includes(lower) ||
			kaomojiCategory.category.toLowerCase().includes(lower)
		);
	}

	return (
		<VList
			itemWidth={240}
			itemHeight={120}
			itemSpacing={{ x: 4, y: 4 }}
			onSelect={onSelect}
		>
			{(
				KAOMOJI?.filter((kaomoji) =>
					searchInKaomoji(search, kaomoji),
				) || []
			)
				.flatMap((kaomojiCategory) => kaomojiCategory.kaomoji)
				.map((kaomoji) => (
					<VListItemTile
						className="!justify-center !items-center text-xl"
						data={kaomoji}
						key={kaomoji}
					>
						{kaomoji}
					</VListItemTile>
				))}
		</VList>
	);
}
