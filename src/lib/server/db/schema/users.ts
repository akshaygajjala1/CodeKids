import { sql } from 'drizzle-orm';
import { boolean, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 128 }).notNull(),
        email: varchar('email', { length: 128 }).notNull(),
        admin: boolean('admin').notNull().default(false),
        hash: varchar('hash').notNull(),
        verified: boolean('verified').notNull().default(false),
        created: timestamp('created')
            .notNull()
            .default(sql`timezone('utc', now())`)
    },
    (table) => ({
        emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`)
    })
);
