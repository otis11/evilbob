export default {
	GoogleSearch: "Google",
	"GoogleSearch.description": "Search Google",
	Google: "Google",
	"Google.description":
		"Google search & Google filters like intitle:youtube.",
	"GoogleDork.intitle":
		'intitle:"Youtube". Searches for pages with a specific keyword in the title',
	"GoogleDork.inurl":
		"inurl:python. Searches for URLs containing a specific keyword",
	"GoogleDork.filetype": "filetype:pdf. Searches for specific file types",
	"GoogleDork.site": "site:github.com. Limits search to a specific website.",
	"GoogleDork.intext":
		'intext:"Hello World".  Searches for pages with a specific keyword in the page content.',
	"GoogleDork.before":
		"before:2000-01-01 after:2001-01-01. Searches for a specific date range.",
	"GoogleDork.or":
		"site:facebook.com | site:twitter.com. Searches for a OR b.",
	"GoogleDork.and":
		"site:facebook.com & site:twitter.com. Searches for a AND b.",
	"GoogleDork.exclude": "-site:facebook.com. Exclude results.",
} as const;
