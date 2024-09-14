import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { readFileSync } from 'fs';
import { building, dev } from '$app/environment';
import pg from 'pg';

const { Pool } = pg;

export let db: NodePgDatabase<Record<string, never>>;

if (!building) {
    const ca = dev ? readFileSync('.env.pg-cert.pem').toString() : process.env.DATABASE_CERTIFICATE
    const pool = new Pool({
        user: 'avnadmin',
        password: process.env.DATABASE_PASSWORD ?? '',
        host: 'codekids-db-codekids-academy.i.aivencloud.com',
        port: 19949,
        database: 'defaultdb',
        ssl: {
            rejectUnauthorized: true,
            ca: ca
        },
        min: 1
    });
    await pool.connect();
    db = drizzle(pool);
}
