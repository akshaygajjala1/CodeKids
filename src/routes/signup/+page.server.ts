import { emailRegex } from '$lib/helpers/regex';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users';
import { signupConfirmation } from '$lib/server/state';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import { sql, eq } from 'drizzle-orm';
import * as crypto from 'node:crypto';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const name = data.get('Name')?.toString().trim();
        const email = data.get('Email')?.toString().trim();
        const password = data.get('Password')?.toString();

        if (!name || !email || !password) {
            return fail(400, { error: 'Missing fields.' });
        }
        if (name.length < 2) {
            return fail(400, { error: 'Names must be at least 2 characters.' });
        }
        if (emailRegex.exec(email) === null) {
            return fail(400, { error: 'Invalid email.' });
        }
        if (password.length < 8) {
            return fail(400, { error: 'Passwords must be at least 8 characters.' });
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(sql`lower(${users.email})`, email.toLowerCase()));

        if (user.length > 0) {
            return fail(400, { error: 'Email already in use.' });
        }

        // TODO: send email

        const hash = await argon2.hash(password);
        const uuid = crypto.randomUUID();
        signupConfirmation.set(uuid, email);
        cookies.set('signupConfirmationCode', uuid, { path: '/' });
        // await db.insert(users).values({ name, email, hash });
        redirect(302, '/confirmation');
    }
} satisfies Actions;
