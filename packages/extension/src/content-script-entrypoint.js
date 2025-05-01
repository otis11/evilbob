/**
 * This file is the content-script entrypoint.
 * This is just a workaround to support top level imports in the content-script.ts
 * Content scripts are imported without type="module", which makes top level imports not available
 * Imported scripts can use top level imports.
 */
/* @vite-ignore */
import("./content-script.js");
