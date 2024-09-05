import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import * as argon2 from 'argon2';
import type { Actions } from './$types';
import { users } from '$lib/server/db/schema/users';
import { eq, sql } from 'drizzle-orm';
import * as crypto from 'node:crypto';
import { confirmations } from '$lib/server/db/schema/confirmations';
import { setAfterCookie } from '$lib/server/db/ephemeral-state';
import { lucia } from '$lib/server/auth';
import { sendMail } from '$lib/server/email';

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
            const emailSuccess = await sendMail({
                toEmail: email,
                subject: 'Verify Your Email',
                text:
                    `Thank you for signing up for CodeKids Academy! Please click the following link to verify your email.\n${returnURL}` +
                    `\n\nIf you did not sign up or believe you recieved this email in error, you can safely ignore this email.`
            });
            if (!emailSuccess) {
                return fail(400, { error: 'Email verification failed to send, try again later.' });
            }
            await db
                .insert(confirmations)
                .values({ uuid: token, userId: user[0].id, confirmationType: 'signup' })
                .onConflictDoUpdate({
                    target: [confirmations.userId, confirmations.confirmationType],
                    set: { uuid: token, created: sql`timezone('utc', now())` }
                });

            // redirect user to after signup page with a cookie
            setAfterCookie(cookies, email);
            redirect(302, '/after-signup');
        }

        const session = await lucia.createSession(user[0].id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });

        redirect(302, '/dashboard');
    }
} satisfies Actions;
