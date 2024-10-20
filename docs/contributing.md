# Themes
This would create a theme with the name `example`.
1. Create a new `example.css` inside `src/themes` to get started. 
2. Copy the contents of `src/themes/dark.css` to include all available variables. 
3. Change `[data-theme="dark"]` to `[data-theme="example"]` and adjust the variables to your liking.
4. Run `bun scripts/generate-themes.ts` to update `themes.ts`.

# References
- [Chrome Extension Api Docs](https://developer.chrome.com/docs/extensions/reference/api)
- [Firefox Extension Api Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)