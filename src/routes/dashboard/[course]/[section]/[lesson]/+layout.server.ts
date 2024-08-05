import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, parent, url }) => {
    const { section, locked, lockedUntil } = await parent();

    const lesson = section.lessons.find((lesson) => lesson.slug === params.lesson);

    if (!lesson) {
        error(404, 'Lesson not found.');
    } else if (lesson.slug === 'index') {
        redirect(302, url.pathname.split('/').slice(0, -1).join('/'));
    }

    if (locked) {
        return {
            lessonTitle: lesson.title,
            locked,
            lockedUntil
        };
    }

    return { lesson, locked, lockedUntil };
}) satisfies LayoutServerLoad;
