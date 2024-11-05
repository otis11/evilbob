## 0.4.0 (November 05, 2024)
- Add `Browser Settings` plugin
- Add `New tab`, `New incognito tab`, `Close tab` and `Restore tabs` to `tab-actions`
- Fix: remove the `scripting` permission as it was unused
- Refactor: minor code improvements.


## 0.3.1 - 0.3.7 (November 02, 2024)
- Buildout fixes: Don't include extra folders in browser.zip file
- bob-command-palette icon fixes: Make icons pixel perfect
- Increase Firefox `strict_min_version` to 109.0

## 0.3.0 (November 02, 2024)
- Add FAQ to website
- Add the default shortcut to open bob for multiple OS
- Add plugins that can't be disabled: `bob-dark-theme`
- Add the option to configure the following shortcuts in settings:
  - Select result: When selecting a result. Default: `Enter`
  - Open result options: When opening the result options. Default: `Shift` `Enter`
  - Next result. Default: `ArrowDown`
  - Previous result. Default: `ArrowUp`
  - Close bob or options. Default: `Escape`
- Add plugins that are enabled per default:
  - bob-dark-theme
  - bob-light-theme
  - bob-results
  - prefixes
  - focus-active-input
  - clear-search-on-focus
  - google
- Add `Browsing Data` as a plugin
  - Delete Browsing data since 15m, 1h, 12h, 1d, 1w, 4w, all time.
- Add Custom theme support again
- Add a loading bar in the search popup
- Add a welcome page which is opened on extension installed
- Improve bob light theme
- Add `Bob Help` command to redirect to the FAQ
- Add `Bob Open Plugins` command to open the plugins page

## 0.2.1 - 0.2.6 (November 01, 2024)
- Extension build & pipeline improvements

## 0.2.0 (November 01, 2024)
- Improvements to CONTRIBUTING.md & README.md
- Refactor code to a plugin based approach
  - Separate settings & enabled plugins into 2 views
  - Move all result groups to plugins
  - Move all themes to plugins
  - Move focus search field & close on window blur into plugins
- Base for multiple languages support (each plugin has their own translations)

## 0.1.2 (October 26, 2024)

First version under GitHub Releases. Not yet published on any extension store like chrome or firefox.
