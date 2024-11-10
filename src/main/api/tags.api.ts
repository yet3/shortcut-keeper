import { getDb } from "@db/db";
import { makeEndpoint } from "@preload/lib";
import type { ITag, ITagDb } from "@typings/tags.type";

export const parseDbTag = (data: ITagDb): ITag => ({
	id: data.id,
	name: data.name,
	colorId: data.colorId,
});

makeEndpoint("tags.selectAll", async (ctx) => {
	const db = getDb();

	const tags = db.prepare<unknown[], ITagDb>("SELECT * FROM tags").all();

	return ctx.success(tags.map(parseDbTag));
});
