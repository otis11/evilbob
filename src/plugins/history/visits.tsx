import { browserApi } from "@/browser-api.ts";
import { VList, VListItem } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { formatTimeAgo } from "@/lib/utils.ts";
import type { PluginViewProps } from "@/plugins";
import { type KeyboardEvent, useState } from "react";

export function Command({ search }: PluginViewProps) {
	const [visits, setVisits] = useState<
		chrome.history.VisitItem[] | undefined
	>();
	const [loadingMessage, setLoadingMessage] = useState("");
	const [url, setUrl] = useState<string>("");

	async function onButtonClick() {
		await loadVisits();
	}

	async function loadVisits() {
		browserApi.history.getVisits({ url }).then((res) => {
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

	async function onKeyUp(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			await loadVisits();
		}
	}

	return (
		<>
			<div className="flex pt-4 items-center">
				<Input
					onKeyUp={onKeyUp}
					className="mr-4"
					placeholder="Enter Url..."
					onChange={(e) => setUrl(e.target.value)}
					value={url}
				></Input>
				<Button onClick={onButtonClick}>Get Visits</Button>
			</div>
			{loadingMessage ? (
				<div className="flex w-full justify-center text-xl">
					{loadingMessage}
				</div>
			) : (
				<>
					<div className="pb-4 pl-2 shrink-0">
						{visits?.length || 0} Visits
					</div>
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
