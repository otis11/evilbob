import { type JSX, useSyncExternalStore } from "react";

let toastContent: JSX.Element | undefined;
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
		<div className="shadow-md absolute top-4 -translate-x-1/2 left-1/2 py-1.5 px-2 border-input rounded-sm border border-solid">
			{toastContent}
		</div>
	);
}

export function toast(content: JSX.Element) {
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

function showToast(content: JSX.Element) {
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
