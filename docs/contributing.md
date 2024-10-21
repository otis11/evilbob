Hello, Hello. Thanks in advance for making Bob a better extension :)!

# Development Setup
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

# New theme
This would create a theme with the name `example`.
1. Create a new `example.css` inside `src/themes` to get started. 
2. Copy the contents of `src/themes/dark.css` to include all available variables. 
3. Change `[data-theme="dark"]` to `[data-theme="example"]` and adjust the variables to your liking.
4. Run `bun scripts/generate-themes.ts` to update `themes.ts`.

# Update docs
4. Run `bun scripts/generate-docs.ts`.

# References
- [Chrome Extension Api Docs](https://developer.chrome.com/docs/extensions/reference/api)
- [Firefox Extension Api Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)