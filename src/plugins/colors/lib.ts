import {rgbaStyleToHex, unique} from "@/lib/utils.ts";
import type {Color} from "@/plugins/colors/components/edit-color.tsx";
import {browserApi} from "@/lib/browser-api.ts";
import {toast} from "@/components/Toast.tsx";

export function getAllColorsInDocument() {
    const colorMap: Record<string, number> = {};
    const allElements = Array.from(document.querySelectorAll("*"));

    function addToColorMap(c: string) {
        try {
            const hex = rgbaStyleToHex(c);
            if (colorMap[hex]) {
                colorMap[hex] += 1;
            } else {
                colorMap[hex] = 1;
            }
        } catch (e) {}
    }

    for (const el of allElements) {
        const style = getComputedStyle(el);
        const possibleColors = [
            style.color,
            style.backgroundColor,
            style.borderColor,
            style.borderInlineColor,
            style.caretColor,
            style.accentColor,
            style.outlineColor,
            style.floodColor,
            style.lightingColor,
            style.scrollbarColor,
            style.fill,
            style.stopColor,
            style.stroke,
        ];
        for (const possibleColor of possibleColors) {
            if (possibleColor.trim() !== "") {
                addToColorMap(possibleColor);
            }
        }
    }

    return Object.keys(colorMap)
        .map((color) => ({
            c: color,
            count: colorMap[color] || 1,
        }))
        .sort((a, b) => {
            if (a.count > b.count) {
                return -1;
            }
            if (a.count < b.count) {
                return 1;
            }
            return 0;
        })
}

export async function saveColor(color: Color) {
    const currentColors: Color[] =
        (await browserApi.storage.sync.get(["colors"])).colors || [];
    currentColors.push({
        c: color.c,
        title: unique(
            color.c,
            currentColors.map((c) => c.title),
        ),
    });
    await browserApi.storage.sync.set({ colors: currentColors });
}
