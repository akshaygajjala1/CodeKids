import { toUrlSafe } from '$lib/helpers/functions';
import { getLesson } from '$lib/helpers/svx';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    const data = await parent();
    const courseContent = await import(
        `../../../content/${data.course.index}-${toUrlSafe(data.course.title)}/index.svx`
    );
    const courseDefaultLesson = getLesson(courseContent, `00-index.svx`)!;

    return {
        content: courseContent.default,
        lesson: courseDefaultLesson,
        ...data
    };
}) satisfies PageLoad;
