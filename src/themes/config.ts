// themes
export const Themes = ["dark", "light"] as const;
export type Theme = (typeof Themes)[number];
export const defaultTheme: Theme = "dark";

// window dimensions
export type Dimension = { width: number; height: number };
export const defaultWindowDimensions = { width: 900, height: 600 };
