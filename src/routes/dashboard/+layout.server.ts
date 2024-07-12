import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getContent } from '$lib/server/svx';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    if (!locals.user) redirect(302, '/login');

    const content = await getContent();
    return {
        courseContent: content,
        path: url.pathname,
    };
};
