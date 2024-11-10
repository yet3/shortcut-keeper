import type { ITag } from "@typings/tags.type";
import { create } from "mutative";
import { writable } from "svelte/store";

interface IStore {
	tags: ITag[];
}

export const tagsStore = writable<IStore>({
	tags: [],
});

export const addTags = (...tags: ITag[]) => {
	tagsStore.update((state) =>
		create(state, (draft) => {
			for (const tag of tags) {
				if (!draft.tags.find((t) => t.id === tag.id)) {
					draft.tags.push(tag);
				}
			}
		}),
	);
};

export const removeTag = (tagId: string) => {
	tagsStore.update((state) =>
		create(state, (draft) => {
			const idx = draft.tags.findIndex((t) => t.id === tagId);
			if (idx >= 0) {
				draft.tags.splice(idx, 1);
			}
		}),
	);
};
