# Development
### Install dependencies
```bash
bun i && bunx playwright install --with-deps
```

#### Start extension in chromium
```bash
bun run dev:chromium
```

#### Linting
```bash
bun run lint
```

#### Testing
```bash
# important build:dev before running the playwright tests
# opening evilbob in playwright depends on a button which only gets injected in dev builds
bun run build:dev
bun run test
```

#### Build the extension
```bash
bun run build # all targets
```
```bash
bun run build:chromium # specific browser only
```

### Adding a new plugin
1. Create a new folder inside `src/plugins`
2. Create an `index.tsx` inside that folder
```js
import { definePlugin } from "@/plugins";
import { CircleFadingArrowUpIcon } from "lucide-react";

export default definePlugin({
    title: "Top Sites",
    description: "Interact with your top sites",
    // icon will be displayed next to all commands available from your plugin in the global command view
    icon: <CircleFadingArrowUpIcon></CircleFadingArrowUpIcon>,
    // browser extension permissions needed if chrome.X apis are used
    // use the browserApi for chrome.X apis, it will communicate with the background script as contentscripts have restricted permissions
    permissions: ["topSites"],
    commands: [
        {
            title: "Top Sites",
            // command = executable async function
            // view = render a custom view on select
            type: "view",
            // refers to the filename which should be executed without a ts/tsx extension
            // all commands should be in the root folder of your plugin
            name: "top-sites",
        },
    ],
});
```

#### Plugin Command Example
```js
//
import { browserApi } from "@/lib/browser-api.ts";

// entrypoint for plugin commands and views will always be the exported "Command" function
export async function Command() {
	await browserApi.downloads.showDefaultFolder();
}
```

#### Plugin Command View Example
```js
import { VList, VListItem } from "@/components/VList.tsx";
import { useMemoryStore } from "@/lib/memory-store.ts";

// This is the view that will be rendered. Always export a function that is named "Command".
export function Command() {
    // useMemoryStore can be used to access and set different state of evilbob
    // use the current search of evilbob
    const [search, useSearch] = useMemoryStore("search");

    function onSelect(data: string) {
        // ...
    }

    // Use the `VList`, `VListItem` & `VListItemTile` components to render lists.
    // They are virtualized lists and can take large amounts of items without performance issues.
    return (
        <>
            <VList onSelect={onSelect}>
                <VListItem
                    // when an item will be select, this data will be given in the onSelect callback
                    data={search}
                    key={1}
                    // item actions, user can open avaible actions in the top right for the focused item
                    actions={<Actions param={search}></Actions>}
                >
                    {search}
                </VListItem>
            </VList>
        </>
    );
}

function Actions({ param }: { param: string }) {
    async function doSomething() {
        // ...
    }

    return (
        <VList>
            <VListItem onClick={doSomething}>Example Action {param}</VListItem>
        </VList>
    );
}
```
