import { type Bang, loadBangs, searchInBang } from "@/lib/bangs/bangs.ts";
import { useEffect, useRef, useState } from "react";
import { VList, type VListChildProps, type VListRef } from "./VList.tsx";

export interface BangsListProps {
	search: string;
	onBangSelect: (bang: Bang) => void;
}
export function BangsList({ search, onBangSelect }: BangsListProps) {
	const [bangs, setBangs] = useState<Bang[] | undefined>(undefined);
	const listRef = useRef<VListRef>(null);

	useEffect(() => {
		loadBangs().then((res: Bang[]) => setBangs(res));
	}, []);

	return (
		<VList
			ref={listRef}
			items={bangs ? bangs.filter((b) => searchInBang(search, b)) : []}
			itemHeight={32}
			itemWidth={-1}
		>
			{({ item, index, style }: VListChildProps<Bang>) => {
				return (
					<VList.Item
						style={style}
						key={index}
						onClick={() => onBangSelect(item)}
					>
						<span>{item.s}</span>
						<span className="pl-4 text-fg-weak font-bold text-sm">
							!{item.t}
						</span>
						<span className="text-fg-weak text-sm pl-4">
							{item.u}
						</span>
					</VList.Item>
				);
			}}
		</VList>
	);
}
