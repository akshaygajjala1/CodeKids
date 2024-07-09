import { toUrlSafe } from '$lib/helpers/functions';
import { getContent } from '$lib/server/svx';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
    const content = await getContent();
    const course = content.find((course) => toUrlSafe(course.title) === params.course)!;
    const section = course.sections.find((section) => toUrlSafe(section.title) === params.section)!;
    const lesson = section.lessons.find((lesson) => lesson.slug === params.lesson);

    if (!lesson || lesson.title === 'index') {
        error(404, 'Lesson not found.');
    }

    return {
        lesson
    };
}) satisfies LayoutServerLoad;