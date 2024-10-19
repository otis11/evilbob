# Themes
This would create a theme with the name `example`.
Create a new `example.css` inside `src/themes` to get started. Copy the contents of `src/themes/dark.css` to include all available variables. Change `[data-theme="dark"]` to `[data-theme="example"]` and adjust the variables to your liking.
Add the theme name to `export const Themes = [..., "example"] as const;` inside `src/themes/config.ts`.
Last, import the theme inside `src/themes/index.ts`
```js
import "./dark.css";
...
import "./example.css";
```
Done :)

# References
- [Chrome Extension Api Docs](https://developer.chrome.com/docs/extensions/reference/api)