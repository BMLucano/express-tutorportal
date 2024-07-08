"use strict";

/** Database setup for tutorportal. */

import { Client } from "pg";
import { getDatabaseUri } from "./config";

const databaseUri: string = getDatabaseUri();

const db: Client = new Client({
  connectionString: databaseUri,
});

async function connectDb(): Promise<void> {
  // Jest replaces console.* with custom methods; get the real ones for this
  const { log, error } = console;
  try {
    await db.connect();
    log(`Connected to ${databaseUri}`);
  } catch (err) {
    error(`Couldn't connect to ${databaseUri}`, err.message);
    process.exit(1);
  }
}
connectDb();

export default db;