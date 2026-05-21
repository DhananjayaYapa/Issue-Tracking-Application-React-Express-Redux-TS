import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../db/schema.js";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const pool = mysql.createPool({ uri: url });

export const db = drizzle(pool, { schema, mode: "default" });

export default db;
