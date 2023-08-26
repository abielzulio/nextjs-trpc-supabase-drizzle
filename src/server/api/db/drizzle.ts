import { env } from "@/env.mjs";
import { drizzle as drizzleConnection } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzleConnection(client);

export type Drizzle = typeof db;

export default db;
