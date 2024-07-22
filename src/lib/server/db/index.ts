import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '$env/static/private';
import { readFileSync } from 'fs';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        ca: readFileSync('.env.pg-cert.pem').toString()
    }
});

await pool.connect();
export const db = drizzle(pool);
