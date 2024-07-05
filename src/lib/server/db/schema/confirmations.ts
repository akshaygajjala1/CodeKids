import { integer, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { sql } from "drizzle-orm";

export const confirmationType = pgEnum('confirmationType', ['signup', 'passwordReset']);

export const confirmations = pgTable(
    'confirmations',
    {
        uuid: uuid('uuid').defaultRandom().primaryKey(),
        userId: integer('userId').references(() => users.id).notNull(),
        created: timestamp('created')
            .notNull()
            .default(sql`timezone('utc', now())`),
        confirmationType: confirmationType('confirmationType').notNull()
    }
)