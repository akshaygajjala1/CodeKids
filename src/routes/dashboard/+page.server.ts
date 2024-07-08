import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getContent } from "$lib/server/svx";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, "/login");

    await getContent();
};