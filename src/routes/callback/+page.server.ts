import { signupConfirmation } from '$lib/server/state';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { confirmations } from '$lib/server/db/schema/confirmations';
import { users } from '$lib/server/db/schema/users';
import { and, eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
   const token = url.searchParams.get("token") ?? '';
   const confirmation = await db.delete(confirmations).where(
    and(
      eq(confirmations.uuid, token),
      eq(confirmations.confirmationType, "signup")
    )
   ).returning()
   if (confirmation.length === 0){
    error(404, "Token not found.");
   }
   if (Date.now() - confirmation[0].created.getTime() > 30 * 60 * 1000){
    error(403, "The token has expired. Try logging in again.");
   }
   redirect(302, "/")

}) satisfies PageServerLoad;
