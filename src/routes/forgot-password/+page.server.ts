import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('Email')?.toString().trim();
        console.log(email);
        return fail(400, { error: 'We could not find an account with the email provided.' });
    }
} satisfies Actions;