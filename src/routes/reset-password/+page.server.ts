import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { setAfterCookie } from '$lib/server/db/ephemeral-state';
import { confirmations } from '$lib/server/db/schema/confirmations';
import { users } from '$lib/server/db/schema/users';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import { eq, and } from 'drizzle-orm';

export const actions = {
    default: async ({ request, cookies, url }) => {
        const data = await request.formData();
        const password = data.get('Password')?.toString();

        if (!password) {
            return fail(400, { error: 'Missing fields.' });
        }
        if (password.length < 8) {
            return fail(400, { error: 'Passwords must be at least 8 characters.' });
        }

        const token = url.searchParams.get('token') ?? '';
        const confirmation = await db
            .delete(confirmations)
            .where(
                and(
                    eq(confirmations.uuid, token),
                    eq(confirmations.confirmationType, 'passwordReset')
                )
            )
            .returning();

        if (confirmation.length === 0) {
            error(404, 'Token not found.');
        }
        if (Date.now() - confirmation[0].created.getTime() > 30 * 60 * 1000) {
            error(403, 'The token has expired. Try logging in again.');
        }

        await lucia.invalidateUserSessions(confirmation[0].userId);
        const hash = await argon2.hash(password);
        await db
            .update(users)
            .set({ hash: hash, verified: true })
            .where(eq(users.id, confirmation[0].userId));

        // redirect user to after reset password page with a cookie
        setAfterCookie(cookies, 'blank');
        redirect(302, '/after-reset-password');
    }
} satisfies Actions;
