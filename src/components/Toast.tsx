import { type JSX, useSyncExternalStore } from "react";

let toastContent: JSX.Element | undefined | string;
const toastDuration = 3000;
const listeners = new Set<() => void>();
let activeTimeout: number | Timer | undefined = undefined;

export function Toast() {
	useSyncExternalStore(
		(listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		() => {
			return toastContent;
		},
	);
	return (
		<div className="z-50 absolute pointer-events-none left-0 right-0 bottom-4 w-full flex justify-center">
			{toastContent ? (
				<div className="animate-slide-bottom-in flex shadow-md items-center py-3 px-4 border-input rounded-sm border border-solid bg-primary text-primary-foreground pointer-events-auto">
					{toastContent}
				</div>
			) : (
				""
			)}
		</div>
	);
}

export function toast(content: JSX.Element | string) {
	if (toastContent) {
		toastContent = undefined;
		updateToasts();
		setTimeout(() => {
			showToast(content);
		}, 100);
		return;
	}
	showToast(content);
}

function updateToasts() {
	for (const l of listeners) {
		l();
	}
}

function showToast(content: JSX.Element | string) {
	toastContent = content;
	updateToasts();
	if (activeTimeout) {
		clearTimeout(activeTimeout);
	}
	activeTimeout = setTimeout(() => {
		toastContent = undefined;
		updateToasts();
	}, toastDuration);
}
