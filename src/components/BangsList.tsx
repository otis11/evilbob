import { type Bang, loadBangs, searchInBang } from "@/lib/bangs/bangs.ts";
import { useEffect, useState } from "react";
import { VList, VListItem } from "./VList.tsx";

export interface BangsListProps {
	search: string;
	onBangSelect: (bang: Bang) => void;
}
export function BangsList({ search, onBangSelect }: BangsListProps) {
	const [bangs, setBangs] = useState<Bang[] | undefined>(undefined);

	useEffect(() => {
		loadBangs().then((res: Bang[]) => setBangs(res));
	}, []);

	return (
		<VList
			data-testid="bangs-list"
			onSelect={(item) => onBangSelect(item.b)}
		>
			{(bangs ? bangs.filter((b) => searchInBang(search, b)) : []).map(
				(item, index) => (
					<VListItem key={item.t} data={item}>
						<span>{item.s}</span>
						<span className="pl-4 text-muted-foreground font-bold text-sm">
							!{item.t}
						</span>
						<span className="text-muted-foreground text-sm pl-4">
							{item.u}
						</span>
					</VListItem>
				),
			)}
		</VList>
	);
}
