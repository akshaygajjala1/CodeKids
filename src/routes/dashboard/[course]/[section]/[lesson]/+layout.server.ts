import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, parent }) => {
    const { section } = await parent();
    const lesson = section.lessons.find((lesson) => lesson.slug === params.lesson);

    if (!lesson || lesson.slug === 'index') {
        error(404, 'Lesson not found.');
    }

    return { lesson };
}) satisfies LayoutServerLoad;
