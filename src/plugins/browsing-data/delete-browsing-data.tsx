import { browserApi } from "@/browser-api.ts";
import { NumberSelect } from "@/components/NumberSelect.tsx";
import { PluginActions } from "@/components/PluginActions";
import { toast } from "@/components/Toast.tsx";
import { VList, VListItem } from "@/components/VList.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function Command() {
	const [isLoading, setIsLoading] = useState(false);
	const [selectValue, setSelectValue] = useState(0);

	async function deleteBrowsingDataSince(since: number) {
		setIsLoading(true);
		await browserApi.browsingData.remove(
			{
				since,
			},
			{
				appcache: true,
				cache: true,
				cacheStorage: true,
				cookies: true,
				downloads: true,
				fileSystems: true,
				formData: true,
				history: true,
				indexedDB: true,
				localStorage: true,
				passwords: true,
				serviceWorkers: true,
				webSQL: true,
			},
		);
		setIsLoading(false);
		toast("Deleted.");
	}

	const minuteInMs = 60 * 1000;
	const hourInMs = minuteInMs * 60;
	const dayInMs = hourInMs * 24;
	const TIMES_AGO = [
		{
			label: "15 minutes ago",
			value: minuteInMs * 15,
		},
		{
			label: "1 hour ago",
			value: hourInMs,
		},
		{
			label: "12 hours ago",
			value: hourInMs * 12,
		},
		{
			label: "1 day ago",
			value: dayInMs,
		},
		{
			label: "1 week ago",
			value: dayInMs * 7,
		},
		{
			label: "4 weeks ago",
			value: dayInMs * 7 * 4,
		},
		{
			label: "All time",
			value: 0,
		},
	];

	return (
		<>
			<PluginActions>
				<VList>
					{TIMES_AGO.map((time) => (
						<VListItem
							key={time.value}
							onClick={() => deleteBrowsingDataSince(time.value)}
						>
							{time.label}
						</VListItem>
					))}
				</VList>
			</PluginActions>
			<div className="flex flex-col items-center h-full justify-center">
				<div className="text-xs pb-4 text-muted-foreground">
					Can also delete via Actions.
				</div>
				<div className="flex items-center justify-center">
					<NumberSelect
						values={TIMES_AGO}
						value={selectValue}
						onValueChange={setSelectValue}
					></NumberSelect>
					<Button
						className="ml-4"
						disabled={isLoading}
						onClick={() => deleteBrowsingDataSince(selectValue)}
					>
						{isLoading ? (
							<>
								<Loader2 className="animate-spin" />
								<span>Please wait</span>
							</>
						) : (
							"Delete"
						)}
					</Button>
				</div>
			</div>
		</>
	);
}
