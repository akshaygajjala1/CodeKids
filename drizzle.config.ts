import { defineConfig } from 'drizzle-kit';
import { readFileSync } from 'fs';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/lib/server/db/schema/*',
    out: './drizzle',
    dbCredentials: {
        user: 'avnadmin',
        password: process.env.DATABASE_PASSWORD ?? '',
        host: 'codekids-db-codekids-academy.i.aivencloud.com',
        port: 19949,
        database: 'defaultdb',
        ssl: {
            rejectUnauthorized: true,
            ca: readFileSync('.env.pg-cert.pem').toString()
        }
    },
    verbose: true,
    strict: true
});
