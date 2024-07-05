import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users';
import { confirmations } from '$lib/server/db/schema/confirmations';
import { eq, sql } from 'drizzle-orm';
import { setAfterCookie } from '$lib/server/db/ephemeral-state';

export const actions = {
    default: async ({ request, url, cookies }) => {
        const data = await request.formData();
        const email = data.get('Email')?.toString().trim() ?? '';

        const userRes = await db
            .select()
            .from(users)
            .where(eq(sql`lower(${users.email})`, email.toLowerCase()));

        if (userRes.length === 0) {
            return fail(400, { error: 'We could not find an account with the email provided.' });
        }

        const token = crypto.randomUUID();
        const returnURL = `${url.origin}/reset-password?token=${token}`;
        // TODO: send the email with returnURL
        console.log(returnURL);

        const user = userRes[0];
        await db
            .insert(confirmations)
            .values({ uuid: token, userId: user.id, confirmationType: 'passwordReset' })
            .onConflictDoUpdate({
                target: [confirmations.userId, confirmations.confirmationType],
                set: { uuid: token, created: sql`timezone('utc', now())` }
            })
            .returning();

        // redirect user to after forgot password page with a cookie
        setAfterCookie(cookies, email);
        redirect(302, '/after-forgot-password');
    }
} satisfies Actions;
