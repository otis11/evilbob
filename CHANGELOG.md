## 0.8.1 (May 14, 2025)
- Improve the description and title of Evilbob
- Plugin `colors`
  - add the `Website Colors` view to list all colors of a website

## 0.8.0 (May 12, 2025)
- Plugin `tabs`
    - when selecting a tab don't create a new one, focus the selected tab instead
    - add copy and close other tabs actions to each tab item
- Plugin `cookies`
    - improve the displayed information for each cookie item
    - add copy actions
    - reload cookies after deleting a cookie
- Plugin `history`
  - add copy actions
  - reload history after removing an item
- Plugin `downloads`
    - add copy actions
- Plugin `top-sites`
    - add copy actions
- Plugin `colors`
  - add the ability to edit the color title and value
  - copy a color to the clipboard when clicked
- Plugin `bookmarks`
  - add command `Remove bookmark current tab` [3d7b7dd](https://github.com/otis11/evilbob/pull/66/commits/3d7b7dd8768f1f2bc4ab920bb36c167e5bc317d8)
  - add `remove` action to each bookmark item in the `bookmarks` command view [3d7b7dd](https://github.com/otis11/evilbob/pull/66/commits/3d7b7dd8768f1f2bc4ab920bb36c167e5bc317d8)
  - add the ability to edit a bookmarks title and url [b4a9518](https://github.com/otis11/evilbob/pull/66/commits/b4a95184b8c1d7506ef5dd015475719d6de6a849)
  - add copy actions
  - reload bookmarks after removing a bookmark
- Add plugin `Emoji & Kaomoji` [0fbfb3e](https://github.com/otis11/evilbob/pull/66/commits/0fbfb3e94d08aca82767cd3b0dd99033ca2411c1)
  - add command view `Emoji` to search and copy emoji
  - add command view `Kaomoji` to search and copy kaomoji
- Don't try to scroll to surroundings items on a list when a mouseover even triggers [4b14e67](https://github.com/otis11/evilbob/pull/66/commits/4b14e674c520382bdf3630230200e30efff31470)
- Hide `Go Back` and `Actions` below the search bar when these actions are not available [8490c42](https://github.com/otis11/evilbob/pull/66/commits/8490c42a401a0fcda83d776429a0cb41962798f1)
- Fixed a bug caused the rgba to hex conversion to be not correct for small values
- Improved error messages displayed
- When hovering over a toast message, stops the timer to close it. Timer to close the toast starts again when the mouse leaves the toast
## 0.7.0 (May 11, 2025)
- Rewrite From Scratch
- Rename from `bob-command-palette` to `Evilbob` and label it as a prototype
- Introduce the concept of plugin commands. Each plugin command can be of type `command` or `view`. A `command` is just a function which gets executed. A `view` renders a custom view provided by the plugin. All Commands are listed in the root command palette.
- Introduce the concept of actions. Each list item or plugin can have actions. Actions can be quickly shown via a shortcut (default `⌘⏎`)
- Add plugins: `bookmarks` `browsing-data` `colors` `cookies` `downloads` `google-new` `history` `management` `sessions` `tabs` `top-sites` `website-media` `window` `youtube`
- Add a virtualized list component to improve rendering and performance
- Add bangs support (https://duckduckgo.com/bang.js). When typing `!` render all bangs and make them searchable

## 0.6.0 (January 05, 2025)
- Feat: add an indicator below the search which prefix is currently active
- Index `tab-actions`: add `split tab out right` to move the tab into a new window and show both Windows 50/50 on screen.
- Index `session-devices`: when selecting a session device open all sessions of that device
- Fix: fix opening multiple bob windows. This occurs when the browser would stop the background service worker for inactivity, which resets a variable value that stored the last active bob window.
- MacOS: Use `⌘` instead of `Ctrl` for the bob open shortcut on the welcome screen.

## 0.5.0 (November 12, 2024)
- Feat: Support multiple levels when showing the options for a result and going back
- Fix: Don't render or go into the options view of a result if the result has no options.
- Plugins: add `Bookmark actions` Index. For instance create a bookmark for the current tab.
- Plugins: add `Youtube` Index. Youtube search and Youtube shortcuts, for instance Youtube History.
- Plugins: add `Tab cookies` Index. List all cookies of a tab or clear all cookies of a tab.
- Plugins: add `filterResults` and `loadFreshData` to BobWindowState which can be used by plugins.
- Index `management`: add `Remove/Uninstall Extension` as a result
- Index `tab-actions`: add `Reload and clear cache (doesn't clear cookies)`, `Copy tab title` and `Sleep other tabs`
- Usage View: add a title for each result usage to make it more clear which result was used.
- Development: add `gen:plugins` and `gen:website` to scripts
- Development: Move `publish_website.yml` workflow to script `gen:website`


## 0.4.1 (November 07, 2024)
- Update manifest name from `bob-command-palette` to `Bob, a command palette for your browser.`
- Add correct extension store links for firefox, edge & chrome

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
