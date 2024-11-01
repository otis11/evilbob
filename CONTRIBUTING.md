
# Contributing to Bob
Thanks in advance for making Bob a better extension :)!

[Code of Conduct](./CODE_OF_CONDUCT.md)

- **Check for Existing Issues**  
  Before contributing, check if any [open issues](https://github.com/otis11/bob-command-palette/issues) relate to your idea.

- **No Relevant Issue?**  
  Open one to discuss your bug or feature suggestion with active developers.

## Development Setup
1. Install [Bun](https://bun.sh/)
2. Go into the project's root folder
3. Run `bun i` to install the project dependencies 
4. Run `bun run watch` to build the extension. It rebuilds automatically on file changes
5. Load the extension in your browser:

**Chrome**
- Open the `chrome://extensions` page.
- Enable **Developer mode**.
- Click **Load unpacked extension**.
- Open the `dist/chrome` folder.

**Firefox**
- Open the `about:addons` page.
- Open the `about:debugging#addons` page.
- Click **Load Temporary Add-on**.
- Open the `dist/firefox/manifest.json` file.

## Update generated docs
4. Run `bun scripts/generate-docs.ts`.

## New plugin?
1. New folder `src/plugins/example`
2. New entry file for your plugin `src/plugins/example/index.ts`
```js
import { defineBobPlugin } from "../../core/BobPlugin";

export default defineBobPlugin({
  name() {
    return 'Example'
  }
})
```

#### Theme
Example: [Bob dark theme](./src/plugins/bob-dark-theme/index.ts)

#### Results
```js
export default defineBobPlugin({
	name() {
		return "Example";
	},
	async provideResults() {
		return [new Example()];
	},
});

export class ExampleResult extends Result {
	title(): string {
		return 'Hello World!';
	}

	async execute(): Promise<void> {
		alert('Result is selected!')
	}
}

```

#### Locale support (typesafe)
```js
import { NewLocales } from "../../core/locales/new-locales";
import enUS from "./locales/en-US";

const { t, setLocale } = NewLocales({
	"en-US": enUS,
});

export default defineBobPlugin({
  name() {
    return t('Example')
  },
  onLocalChange(state) {
		setLocale(state.locale);
	},
})
```

## References
- [Chrome Extension Api Docs](https://developer.chrome.com/docs/extensions/reference/api)
- [Firefox Extension Api Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)