import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import * as argon2 from 'argon2';
import type { Actions } from './$types';
import { users } from '$lib/server/db/schema/users';
import { eq, sql } from 'drizzle-orm';
import * as crypto from 'node:crypto';
import { confirmations } from '$lib/server/db/schema/confirmations';
import { setAfterCookie } from '$lib/server/db/ephemeral-state';

export const actions = {
    default: async ({ request, cookies, url }) => {
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
            const token = crypto.randomUUID();
            const returnURL = `${url.origin}/verify-email?token=${token}`;
            // TODO: send the email with returnURL
            console.log(returnURL);
            await db
                .insert(confirmations)
                .values({ uuid: token, userId: user[0].id, confirmationType: 'signup' })
                .onConflictDoUpdate({
                    target: [confirmations.userId, confirmations.confirmationType],
                    set: { uuid: token, created: sql`timezone('utc', now())` }
                })
                .returning();

            // redirect user to after signup page with a cookie
            setAfterCookie(cookies, email);
            redirect(302, '/after-signup');
        }

        redirect(302, '/');
    }
} satisfies Actions;
