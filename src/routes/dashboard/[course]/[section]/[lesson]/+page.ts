import { toUrlSafe } from '$lib/helpers/functions';
import { getLesson } from '$lib/helpers/svx';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    const { course, section, lesson } = await parent();
    const courseName = `${course.index}-${toUrlSafe(course.title)}`;
    const sectionName = `${section.index.toString().padStart(2, '0')}-${toUrlSafe(section.title)}`;
    const lessonName = `${lesson.index.toString().padStart(2, '0')}-${lesson.slug}`;
    const lessonFile = await import(
        `../../../../../content/${courseName}/${sectionName}/${lessonName}.svx`
    );
    const lessonObj = getLesson(lessonFile, `${lessonName}.svx`);

    return {
        content: lessonFile.default,
        lesson: lessonObj
    };
}) satisfies PageLoad;
