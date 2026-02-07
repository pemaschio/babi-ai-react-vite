import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema.js";

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
});

export const db = drizzle(pool, { schema });
