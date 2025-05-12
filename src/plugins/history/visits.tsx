import { VList, VListItem } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { browserApi } from "@/lib/browser-api.ts";
import { EvilbobRoot } from "@/lib/evilbob-root.tsx";
import { useMemoryStore } from "@/lib/memory-store.ts";
import { formatTimeAgo } from "@/lib/utils.ts";
import { useEffect, useState } from "react";

export function Command() {
	const [visits, setVisits] = useState<
		chrome.history.VisitItem[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("");
	const [search, setSearch] = useMemoryStore("search");

	async function onButtonClick() {
		await loadVisits();
	}

	useEffect(() => {
		const onEnter = () => {
			if (search === "") {
				return;
			}
			loadVisits().then();
		};
		EvilbobRoot.instance().onSearchEnter(onEnter);
		return () => EvilbobRoot.instance().removeOnSearchEnter(onEnter);
	}, [search]);

	async function loadVisits() {
		browserApi.history.getVisits({ url: search }).then((res) => {
			if (!Array.isArray(res)) {
				setLoadingMessage("Failed loading history..");
				return;
			}
			if (res.length === 0) {
				setLoadingMessage("0 Visits found.");
				return;
			}
			setLoadingMessage("");
			setVisits(res);
		});
	}

	return (
		<>
			<div className="flex py-4 items-center justify-center">
				<span className="shrink-0 pr-4 text-muted-foreground">
					{visits?.length || 0} Visits
				</span>
				<Button onClick={onButtonClick}>Get Visits</Button>
				<span className="pl-4 text-muted-foreground">Type url ^</span>
			</div>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl mt-4">
					{loadingMessage}
				</div>
			) : (
				<>
					<VList>
						{(visits || []).map((item) => (
							<VListItem data={item} key={item.visitId}>
								<span>{formatTimeAgo(item.visitTime)}</span>
								<span className="text-muted-foreground pl-4 truncate shrink-0">
									{item.transition}
								</span>
							</VListItem>
						))}
					</VList>
				</>
			)}
		</>
	);
}
