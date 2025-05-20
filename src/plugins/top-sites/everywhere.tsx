import { VList, VListItem, VListItemIcon } from "@/components/VList";
import { browserApi } from "@/lib/browser-api.ts";
import { copyTextToClipboard, getFaviconUrl } from "@/lib/utils";

export async function AdditionalSearchItems() {
	const topSites = await browserApi.topSites.get();
	return topSites.map((site) => ({
		search: site.title + site.url,
		content: (
			<VListItem
				data={site}
				key={site.url}
				actions={<Actions {...site}></Actions>}
			>
				<VListItemIcon url={getFaviconUrl(site.url)}></VListItemIcon>
				<span>{site.title}</span>
				<span className="text-muted-foreground pl-4 truncate">
					{site.url}
				</span>
			</VListItem>
		),
	}));
}

function Actions(site: chrome.topSites.MostVisitedURL) {
	return (
		<VList>
			<VListItem key={1} onClick={() => copyTextToClipboard(site.url)}>
				Copy url
			</VListItem>
			<VListItem key={2} onClick={() => copyTextToClipboard(site.title)}>
				Copy title
			</VListItem>
		</VList>
	);
}
