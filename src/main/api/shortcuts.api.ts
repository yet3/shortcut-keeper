import { getDb } from "@db/db";
import { makeEndpoint } from "@preload/lib";
import { parseJson } from "@shared-lib/parseJson.lib";
import type {
	INewShortcut,
	IShortcut,
	IShortcutDb,
} from "@typings/shortcuts.type";
import type { ITagDb } from "@typings/tags.type";

const parseDbShortcut = (data: IShortcutDb): IShortcut => ({
	id: data.id,
	name: data.name,
	description: data.description,
	combination: data.combination,
	parserVersion: data.parserVersion,
	tagsIds: new Set<string>(parseJson(data.tagsIds, [])),
});

makeEndpoint("shortcuts.selectAll", async (ctx) => {
	const db = getDb();

	const shortcuts = db
		.prepare(`
    SELECT 
      shortcuts.*, 
      '[' || GROUP_CONCAT('"' || tags.tagId || '"', ', ') || ']' AS tagsIds 
    FROM shortcuts 
    LEFT JOIN shortcut_tags AS tags ON tags.shortcutId = shortcuts.id 
    GROUP BY shortcuts.id
    ORDER BY shortcuts.createdAt DESC;
    `)
		.all() as IShortcutDb[];

	return ctx.success(shortcuts.map(parseDbShortcut));
});

makeEndpoint("shortcuts.deleteOne", async (ctx, { shortcutId }) => {
	const db = getDb();

	let deleted: { id: string } | undefined;
	db.transaction(() => {
		// 1. remove tags' links
		const tagsIds = db
			.prepare<string, { tagId: string }>(
				"DELETE FROM shortcut_tags WHERE shortcutId = ? RETURNING tagId",
			)
			.all(shortcutId);

		// 2. remove unused tags
		db.prepare(
			`DELETE FROM tags 
		   WHERE tags.id IN (${tagsIds.map(() => "?").join(", ")}) AND (SELECT tt.id FROM shortcut_tags AS tt WHERE tt.tagId = tags.id LIMIT 1) IS NULL`,
		).run(...tagsIds.flatMap((t) => t.tagId));

		// 3. remove shortcut
		deleted = db
			.prepare<string, { id: string }>(
				"DELETE FROM shortcuts WHERE id = ? RETURNING id",
			)
			.get(shortcutId);
	})();

	if (!deleted) {
		return ctx.error("Error deleting shortcut", { shortcutId });
	}

	return ctx.success({ shortcutId: deleted.id });
});

makeEndpoint("shortcuts.saveOne", async (ctx, data) => {
	const db = getDb();

	let shortcutDb: IShortcutDb | undefined;
	db.transaction(() => {
		// 1. add new shortcut
		db.prepare<INewShortcut, IShortcutDb>(
			`INSERT INTO shortcuts (id, name, description, combination, parserVersion) 
        VALUES ($id, $name, $description, $combination, $parserVersion) 
        ON CONFLICT(id) DO UPDATE SEt
          name = $name, description = $description, 
          combination = $combination, parserVersion = $parserVersion`,
		).run(data.shortcut);

		// 2. add new tags
		if (data.tags.length > 0) {
			db.prepare<string[], ITagDb>(
				`INSERT OR IGNORE INTO tags (id, name, colorId) VALUES ${data.tags.map(() => "(?, ?, ?)").join(", ")}`,
			).run(...data.tags.flatMap((t) => [t.id, t.name, t.colorId]));

			// 3. link tags to shortcut
			db.prepare<string[], ITagDb>(
				`INSERT OR IGNORE INTO shortcut_tags (tagId, shortcutId) VALUES ${data.tags.map(() => "(?, ?)").join(", ")}`,
				// biome-ignore lint lint/style/noNonNullAssertion:
			).run(...data.tags.flatMap((t) => [t.id, data.shortcut.id]));
		}

		// 4. unlink unused tags
		db.prepare<string[], ITagDb>(
			`DELETE FROM shortcut_tags WHERE shortcutId = ? AND tagId NOT IN (${data.tags.map(() => "?").join(", ")})`,
		).run(data.shortcut.id, ...data.tags.flatMap((t) => t.id));

		// 5. remove unused tags
		db.prepare(
			"DELETE FROM tags WHERE (SELECT tt.id FROM shortcut_tags AS tt WHERE tt.tagId = tags.id LIMIT 1) IS NULL",
		).run();

		// 6. get shortcut with tag ids
		shortcutDb = db
			.prepare<string, IShortcutDb>(`
      SELECT 
        shortcuts.*, 
        '[' || GROUP_CONCAT('"' || tags.tagId || '"', ', ') || ']' AS tagsIds 
      FROM shortcuts 
      LEFT JOIN shortcut_tags AS tags ON tags.shortcutId = shortcuts.id 
      WHERE shortcuts.id = ?
      GROUP BY shortcuts.id
      ORDER BY shortcuts.createdAt DESC;
      `)
			.get(data.shortcut.id);
	})();

	if (!shortcutDb) {
		return ctx.error("Error saving shortcut", data);
	}

	return ctx.success({
		shortcut: parseDbShortcut(shortcutDb),
		tags: data.tags,
	});
});
