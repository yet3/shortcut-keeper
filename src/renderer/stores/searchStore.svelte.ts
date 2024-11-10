import type { ITag } from "@typings/tags.type";
import { create } from "mutative";
import { writable } from "svelte/store";

interface IStore {
	query: string;
	tags: ITag[];
	keys: string[];
}

export const searchStore = writable<IStore>({
	query: "",
	tags: [],
	keys: [],
});

export const addSearchTag = (tag: ITag) => {
	searchStore.update((state) =>
		create(state, (draft) => {
			if (!draft.tags.find((t) => t.id === tag.id)) {
				draft.tags.push(tag);
			}
		}),
	);
};

export const removeSearchTag = (tagId: string) => {
	searchStore.update((state) =>
		create(state, (draft) => {
			const idx = draft.tags.findIndex((t) => t.id === tagId);
			if (idx >= 0) {
				draft.tags.splice(idx, 1);
			}
		}),
	);
};

export const addSearchKey = (key: string) => {
	searchStore.update((state) =>
		create(state, (draft) => {
			if (!draft.keys.find((el) => el === key)) {
				draft.keys.push(key);
			}
		}),
	);
};

export const removeSearchKey = (key: string) => {
	searchStore.update((state) =>
		create(state, (draft) => {
			const idx = draft.keys.findIndex((el) => el === key);
			if (idx >= 0) {
				draft.keys.splice(idx, 1);
			}
		}),
	);
};
