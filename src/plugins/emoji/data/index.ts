// the source of the emoji.json list:
// https://github.com/github/gemoji

/*
Copyright (c) 2019 GitHub, Inc.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
 */

import emoji from "./emoji.json";
import kaomojiCo from "./kaomoji-co.json";
import kaomojiCustom from "./kaomoji-custom.json";
// the source of the kaomoji-co.json was partially sourced from https://www.kaomoji.co/en-de/pages/emoji
export interface Emoji {
	emoji: string;
	description: string;
	category: string;
	aliases: string[];
	tags: string[];
	unicode_version: string;
	ios_version: string;
}
export interface KaomojiCategory {
	category: string;
	description: string;
	kaomoji: string[];
}
export const EMOJI: Emoji[] = emoji;
export const KAOMOJI: KaomojiCategory[] = [...kaomojiCo, ...kaomojiCustom];

/*
This function can be used to extract kaomoji from https://www.kaomoji.co/en-de/pages/emoji
function extractFromKaomojiCoWebsite() {
    const container = document.getElementById("emojiContainer")
    let currentCategory = ""
    let currentSubCategory = ""
    let all = []
    const duplicateTracker = {}
    for(const el of Array.from(container?.children || [])) {
        let category = currentCategory + " " + currentSubCategory;
        if(el.tagName === "H3") {
            currentSubCategory = el.innerText.trim().toLowerCase()
            category = currentCategory + " " + currentSubCategory;
            all.push({category, kaomoji: [] })
        }
        if(el.tagName === "H2") {
            currentCategory = el.innerText.trim().toLowerCase()
        }
        if(el.tagName === "P") {
            const foundCategory = all.find(c => c.category === category)
                if(foundCategory) {
                    foundCategory.description = el.innerText.trim()
                }
        }
        if(el.classList.contains("emoji")) {
            const v = el.innerText.trim()
            if(duplicateTracker[v]) {
                console.warn("duplicate ignored", v)
                continue
            }
            all.find(c => c.category === category).kaomoji.push(v)
            duplicateTracker[v] = true
        }
    }
    return all
}
 */
