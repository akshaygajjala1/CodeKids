import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { toUrlSafe } from '$lib/helpers/functions';

export const load = (async ({ params, parent }) => {
    const { courseContent } = await parent();
    const course = courseContent.find((course) => toUrlSafe(course.title) === params.course)!;

    if (!course) {
        error(404, 'Course not found.');
    }

    return { course };
}) satisfies LayoutServerLoad;
