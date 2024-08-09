import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { env } from '$env/dynamic/private';
import { readFileSync } from 'fs';
import { building } from '$app/environment';
import pg from 'pg';

const { Pool } = pg;

export let db: NodePgDatabase<Record<string, never>>;

if (!building) {
    const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: {
            ca: env.DATABASE_CERTIFICATE ?? readFileSync('.env.pg-cert.pem').toString()
        },
        min: 1
    });
    await pool.connect();
    db = drizzle(pool);
}
