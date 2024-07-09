import { toUrlSafe } from '$lib/helpers/functions';
import { getContent } from '$lib/server/svx';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
    const content = await getContent();
    const course = content.find((course) => toUrlSafe(course.title) === params.course)!;
    const section = course.sections.find((section) => toUrlSafe(section.title) === params.section);
    
    if (!section) {
        error(404, 'Section not found.');
    }

    return {
        section
    };
}) satisfies LayoutServerLoad;