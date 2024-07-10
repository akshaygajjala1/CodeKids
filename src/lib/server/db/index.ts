import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '$env/static/private';
import { readFileSync } from 'fs';
import pg from 'pg';

const { Client } = pg;

const pool = new Client({
    connectionString: DATABASE_URL,
    ssl: {
        ca: readFileSync('.env.pg-cert.pem').toString()
    },
    connectionTimeoutMillis: 0
});

await pool.connect();
export const db = drizzle(pool);
