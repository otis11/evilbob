import { toast } from "@/components/Toast.tsx";
import { VList, VListItemTile } from "@/components/VList.tsx";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { copyTextToClipboard } from "@/lib/utils.ts";
import { EMOJI, type Emoji } from "./data";

export function Command() {
	const [search, setSearch] = useMemoryStore("search");

	async function onSelect(emoji: Emoji) {
		await copyTextToClipboard(emoji.emoji);
		toast("Copied.");
	}

	function searchInEmoji(s: string, emoji: Emoji) {
		const lower = s.toLowerCase();
		if (emoji.description.includes(lower)) {
			return true;
		}
		if (emoji.category.toLowerCase().includes(lower)) {
			return true;
		}

		let found = false;
		for (const alias of emoji.aliases) {
			if (alias.includes(lower)) {
				found = true;
				break;
			}
		}
		if (found) {
			return true;
		}
		for (const tag of emoji.tags) {
			if (tag.includes(lower)) {
				found = true;
				break;
			}
		}
		return found;
	}

	return (
		<VList
			itemWidth={120}
			itemHeight={120}
			itemSpacing={{ x: 4, y: 4 }}
			onSelect={onSelect}
		>
			{(EMOJI?.filter((emoji) => searchInEmoji(search, emoji)) || []).map(
				(emoji, index) => (
					<VListItemTile
						className="!justify-center !items-center text-5xl"
						data={emoji}
						key={emoji.emoji}
					>
						{emoji.emoji}
					</VListItemTile>
				),
			)}
		</VList>
	);
}
