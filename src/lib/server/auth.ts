import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { sessions } from './db/schema/sessions';
import { users } from './db/schema/users';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
        return {
            // attributes has the type of DatabaseUserAttributes
            id: attributes.id,
            name: attributes.name,
            email: attributes.email,
            admin: attributes.admin
        };
    }
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        UserId: number;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    id: number;
    name: string;
    email: string;
    admin: boolean;
}
