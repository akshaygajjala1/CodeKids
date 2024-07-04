import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import * as argon2 from 'argon2';
import type { Actions } from './$types';
import { users } from '$lib/server/db/schema/users';
import { eq, sql } from 'drizzle-orm';
import { signupConfirmation } from '$lib/server/state';
import * as crypto from 'node:crypto';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('Email')?.toString().trim();
        const password = data.get('Password')?.toString();
        if (!email || !password) {
            return fail(400, { error: 'Missing fields.' });
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(sql`lower(${users.email})`, email.toLowerCase()));

        if (user.length === 0) {
            return fail(403, { error: 'Invalid email / password.' });
        }
        if (!(await argon2.verify(user[0].hash, password))) {
            return fail(403, { error: 'Invalid email / password.' });
        }

        if (!user[0].verified) {
            // TODO: send email
            const uuid = crypto.randomUUID();
            signupConfirmation.set(uuid, email);
            cookies.set('signupConfirmationCode', uuid, { path: '/' });
            redirect(302, '/confirmation');
        }

        redirect(302, '/');
    }
} satisfies Actions;
