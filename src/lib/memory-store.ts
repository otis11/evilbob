import type { EvilbobConfig } from "@/lib/config.ts";
import type { Plugin, PluginCommandExtended } from "@/plugins";
import {
	type FunctionComponent,
	type JSX,
	type SetStateAction,
	useEffect,
	useState,
} from "react";

interface MemoryStoreData {
	config: EvilbobConfig | undefined;
	search: string;
	searchHint: string;
	lastGlobalSearch: string;

	isActionsOpen: boolean;
	actions: JSX.Element | JSX.Element[] | undefined;

	// plugins
	plugins: Plugin[] | undefined;
	PluginView: FunctionComponent | undefined;
	pluginViewCommand: PluginCommandExtended | undefined;

	isCommandExecuting: boolean;
	isFullscreen: boolean;
}

class MemoryStore<T> {
	constructor(private initialData: T) {
		for (const key in this.initialData) {
			this.data.set(key, this.initialData[key]);
		}
	}

	private readonly subscribers = new Map<
		keyof T,
		((newValue: T[keyof T]) => void)[]
	>();

	private readonly data = new Map<keyof T, T[keyof T]>();

	set<K extends keyof T>(key: K, value: T[K]) {
		this.data.set(key, value);
		for (const subscriber of this.subscribers.get(key) || []) {
			subscriber(value);
		}
	}
	get<K extends keyof T>(key: K) {
		return this.data.get(key) as T[K];
	}
	subscribe<K extends keyof T>(key: K, callback: (newValue: T[K]) => void) {
		const currentSubscribers = this.subscribers.get(key) || [];
		// @ts-expect-error TODO fix, seems to be correct though
		currentSubscribers.push(callback);
		this.subscribers.set(key, currentSubscribers);
	}
	unsubscribe<K extends keyof T>(key: K, callback: (newValue: T[K]) => void) {
		let currentSubscribers = this.subscribers.get(key) || [];
		currentSubscribers = currentSubscribers.filter(
			(subscriber) => subscriber !== callback,
		);
		this.subscribers.set(key, currentSubscribers);
	}
}

export const memoryStore = new MemoryStore<MemoryStoreData>({
	searchHint: "",
	PluginView: undefined,
	search: "",
	pluginViewCommand: undefined,
	isCommandExecuting: false,
	actions: undefined,
	isActionsOpen: false,
	config: undefined,
	plugins: undefined,
	isFullscreen: false,
	lastGlobalSearch: "",
});

export const useMemoryStore = <K extends keyof MemoryStoreData>(key: K) => {
	const [value, setValue] = useState<MemoryStoreData[K]>(
		memoryStore.get(key) as MemoryStoreData[K],
	);
	const set = (value: SetStateAction<MemoryStoreData[K]>) => {
		setValue(value);
		memoryStore.set(key, value as MemoryStoreData[K]);
	};
	useEffect(() => {
		memoryStore.subscribe(key, setValue);
		return () => memoryStore.unsubscribe(key, setValue);
	}, [key]);
	return [value, set] as const;
};
