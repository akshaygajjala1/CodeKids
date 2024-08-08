import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { confirmations } from '$lib/server/db/schema/confirmations';
import { and, eq } from 'drizzle-orm';
import { users } from '$lib/server/db/schema/users';
import { lucia } from '$lib/server/auth';

export const load = (async ({ url, cookies }) => {
    const token = url.searchParams.get('token') ?? '';
    const confirmation = await db
        .delete(confirmations)
        .where(and(eq(confirmations.uuid, token), eq(confirmations.confirmationType, 'signup')))
        .returning();

    if (confirmation.length === 0) {
        error(404, 'Token not found.');
    }
    if (Date.now() - confirmation[0].created.getTime() > 30 * 60 * 1000) {
        error(403, 'The token has expired. Try logging in again.');
    }

    await db.update(users).set({ verified: true }).where(eq(users.id, confirmation[0].userId));
    const session = await lucia.createSession(confirmation[0].userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
    });

    redirect(302, '/dashboard');
}) satisfies PageServerLoad;
