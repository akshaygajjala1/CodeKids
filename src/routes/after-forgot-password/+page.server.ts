import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAndDeleteAfterCookie } from '$lib/server/db/ephemeral-state';

export const load = (async ({ cookies }) => {
    const email = getAndDeleteAfterCookie(cookies);

    if (email) {
        return { email };
    } else {
        redirect(302, '/forgot-password');
    }
}) satisfies PageServerLoad;
