export interface ITag {
	id: string;
	name: string;
	colorId: string;
}

// TODO: unsed?
export type INewTag = Omit<ITag, "id">;

export type ITagDb = ITag;
