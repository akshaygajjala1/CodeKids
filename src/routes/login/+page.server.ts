import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('Email')?.toString().trim();
        const password = data.get('Password')?.toString();
        console.log(email, password);
        return fail(403, { error: 'Invalid email / password.' });
    }
} satisfies Actions;