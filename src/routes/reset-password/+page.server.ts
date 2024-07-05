import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users';
import { signupConfirmation } from '$lib/server/state';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import { sql, eq } from 'drizzle-orm';
import * as crypto from 'node:crypto';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const password = data.get('Password')?.toString();

        if (!password) {
            return fail(400, { error: 'Missing fields.' });
        }


        if (password.length < 8) {
            return fail(400, { error: 'Passwords must be at least 8 characters.' });
        }
      
    }
} satisfies Actions;
