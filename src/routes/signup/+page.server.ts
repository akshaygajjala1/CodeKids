import { emailRegex } from '$lib/helpers/regex';
import { db } from '$lib/server/db';
import { setAfterCookie } from '$lib/server/db/ephemeral-state';
import { confirmations } from '$lib/server/db/schema/confirmations';
import { users } from '$lib/server/db/schema/users';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import { sql, eq } from 'drizzle-orm';
import * as crypto from 'node:crypto';

export const actions = {
    default: async ({ request, cookies, url }) => {
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

        const prevUser = await db
            .select()
            .from(users)
            .where(eq(sql`lower(${users.email})`, email.toLowerCase()));

        if (prevUser.length > 0) {
            return fail(400, { error: 'Email already in use.' });
        }

        const token = crypto.randomUUID();
        const returnURL = `${url.origin}/verify-email?token=${token}`;
        // TODO: send the email with returnURL
        console.log(returnURL);
        const hash = await argon2.hash(password);
        const userRes = await db.insert(users).values({ name, email, hash }).returning();
        const user = userRes[0];
        await db
            .insert(confirmations)
            .values({ uuid: token, userId: user.id, confirmationType: 'signup' })
            .onConflictDoUpdate({
                target: [confirmations.userId, confirmations.confirmationType],
                set: { uuid: token, created: sql`timezone('utc', now())` }
            });

        // redirect user to after signup page with a cookie
        setAfterCookie(cookies, email);
        redirect(302, '/after-signup');
    }
} satisfies Actions;
