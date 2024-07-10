import { toUrlSafe } from '$lib/helpers/functions';
import { getLesson } from '$lib/helpers/svx';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    const { course, section } = await parent();
    const courseName = `${course.index}-${toUrlSafe(course.title)}`;
    const sectionName = `${section.index.toString().padStart(2, '0')}-${toUrlSafe(section.title)}`;
    const defaultLesson = await import(
        `../../../../content/${courseName}/${sectionName}/00-index.svx`
    );
    const lesson = getLesson(defaultLesson, '00-index.svx')!;

    return {
        content: defaultLesson.default,
        lesson
    };
}) satisfies PageLoad;
