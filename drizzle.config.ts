import { defineConfig } from 'drizzle-kit';
import { readFileSync } from 'fs';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/lib/server/db/schema/*',
    out: './drizzle',
    dbCredentials: {
        url: process.env.DATABASE_URL ?? '',
        ssl: {
            rejectUnauthorized: true,
            ca: readFileSync('.env.pg-cert.pem').toString()
        }
    },
    verbose: true,
    strict: true
});
