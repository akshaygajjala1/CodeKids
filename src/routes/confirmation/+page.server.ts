import { signupConfirmation } from '$lib/server/state';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const code = cookies.get('signupConfirmationCode') ?? '';

    if (signupConfirmation.get(code)) {
        cookies.delete('signupConfirmationCode', { path: '' });
        const email = signupConfirmation.get(code) ?? '';
        signupConfirmation.delete(code);
        return { email };
    } else {
        redirect(302, '/signup');
    }
}) satisfies PageServerLoad;
