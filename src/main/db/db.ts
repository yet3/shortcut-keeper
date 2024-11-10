import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { makeEndpoint } from "@preload/lib";
import Database from "better-sqlite3";

let db: Database.Database | null = null;

export const getDb = () => {
	if (!db) {
		throw new Error("Database is not defined");
	}
	return db;
};

makeEndpoint("db.init", async (ctx, { dirPath }) => {
	if (db) {
		return ctx.success(true);
	}

	const dbDir = dirPath;
	try {
		if (!existsSync(dbDir)) {
			mkdirSync(dbDir);
		}
	} catch (e) {
		return ctx.error(`${e?.toString()}`, { dbDirPath: dbDir });
	}

	const dbFilePath = join(dbDir, "database.db");
	try {
		db = new Database(dbFilePath);
	} catch (e) {
		return ctx.error(`Error initializing db: ${e?.toString()}`, {
			dbFilePath,
		});
	}

	db.loadExtension("/Users/yet3/.sqlpkg/nalgeon/uuid/uuid.dylib");

	db.pragma("journal_mode = WAL");
	db.pragma("foreign_keys = ON");

	db.exec(readFileSync("./src/main/db/schema.sql", "utf-8"));

	return ctx.success(true);
});
