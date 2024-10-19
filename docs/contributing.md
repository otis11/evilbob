# Themes
This would create a theme with the name `example`.
1. Create a new `example.css` inside `src/themes` to get started. Copy the contents of `src/themes/dark.css` to include all available variables. 
2. Change `[data-theme="dark"]` to `[data-theme="example"]` and adjust the variables to your liking.
3. Add the theme name to `export const Themes = [..., "example"] as const;` inside `src/themes/config.ts`.
4. Last, import the theme inside `src/themes/index.ts`
```js
import "./dark.css";
...
import "./example.css";
```
Done :)

# References
- [Chrome Extension Api Docs](https://developer.chrome.com/docs/extensions/reference/api)
- [Firefox Extension Api Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)