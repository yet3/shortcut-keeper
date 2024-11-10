
export interface IShortcut {
	id: string;

	name: string;
	description: string;
	combination: string;
	parserVersion: number;

	tagsIds: Set<string>;
}

export type INewShortcut = Omit<IShortcut, "tagsIds">;

export interface IShortcutDb extends Omit<IShortcut, "tagsIds"> {
	tagsIds: string | null;
}
