import { toUrlSafe } from '$lib/helpers/functions';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, parent }) => {
    const { course } = await parent();
    const section = course.sections.find((section) => toUrlSafe(section.title) === params.section);

    if (!section) {
        error(404, 'Section not found.');
    }

    return { section };
}) satisfies LayoutServerLoad;
