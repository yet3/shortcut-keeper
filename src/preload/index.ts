import type { INewShortcut, IShortcut } from "@typings/shortcuts.type";
import type { ITag } from "@typings/tags.type";
import { contextBridge } from "electron";
import { declareEndpoint, invokeApi, makeApi } from "./lib";

const API = makeApi({
	// db
	"db.init": declareEndpoint<
		{ dirPath: string },
		boolean,
		{ dbDirPath?: string; dbFilePath?: string }
	>,

	// tags
	"tags.selectAll": declareEndpoint<never, ITag[]>,

	// shortcuts
	"shortcuts.selectAll": declareEndpoint<never, IShortcut[]>,
	"shortcuts.deleteOne": declareEndpoint<
		{ shortcutId: string },
		{ shortcutId: string },
		{ shortcutId: string }
	>,
	"shortcuts.saveOne": declareEndpoint<
		{ shortcut: INewShortcut; tags: ITag[] },
		{ shortcut: IShortcut; tags: ITag[] },
		{ shortcut: INewShortcut; tags: ITag[] }
	>,
});

export type IApi = typeof API;
export type IApiKeys = keyof IApi;

try {
	contextBridge.exposeInMainWorld("api", invokeApi);
} catch (e) {
	console.error(e);
}
