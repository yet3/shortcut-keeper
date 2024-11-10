import type { IShortcut } from "@typings/shortcuts.type";
import { create } from "mutative";
import { writable } from "svelte/store";

interface IStore {
	shortcuts: IShortcut[];
}

export const shortcutsStore = writable<IStore>({ shortcuts: [] });

export const saveShortcut = (shortcut: IShortcut) => {
	shortcutsStore.update((state) =>
		create(state, (draft) => {
			const idx = draft.shortcuts.findIndex((el) => el.id === shortcut.id);
			if (idx >= 0) {
				draft.shortcuts[idx] = {
					...draft.shortcuts[idx],
					...shortcut,
				};
			} else {
				draft.shortcuts.push(shortcut);
			}
		}),
	);
};

export const removeShortcut = (id: string) => {
	shortcutsStore.update((state) =>
		create(state, (draft) => {
			const idx = draft.shortcuts.findIndex((el) => el.id === id);
			if (idx >= 0) {
				draft.shortcuts.splice(idx, 1);
			}
		}),
	);
};
