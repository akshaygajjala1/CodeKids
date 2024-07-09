import { error } from '@sveltejs/kit';
import type { Course } from '../../../types';
import type { LayoutServerLoad } from './$types';
import { getContent } from '$lib/server/svx';
import { toUrlSafe } from '$lib/helpers/functions';

export const load = (async ({ params }) => {
    const content = await getContent();
    const course = content.find((course) => toUrlSafe(course.title) === params.course)!;

    if (!course) {
        error(404, 'Course not found.');
    }

    return { course };
}) satisfies LayoutServerLoad;