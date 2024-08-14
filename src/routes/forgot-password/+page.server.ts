import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users';
import { confirmations } from '$lib/server/db/schema/confirmations';
import { eq, sql } from 'drizzle-orm';
import { setAfterCookie } from '$lib/server/db/ephemeral-state';
import { sendMail } from '$lib/server/email';

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
        const emailSuccess = await sendMail({
            toEmail: email,
            subject: 'Reset Your Password',
            text: `If you made a request to change your password, click on the link below to reset your password.\n${returnURL}` +
                  `\n\nIf you did not make a request to change your password or believe this email was sent in error, ` + 
                  `you can safely ignore this email.`
        });
        if (!emailSuccess) {
            return fail(400, { error: 'Password reset email failed to send, try again later.' });
        }

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
