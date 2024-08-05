import type { Lesson, LessonMetadata } from '../../types';

export const getLesson = (file: unknown, name: string): Lesson | void => {
    const filename = name.split('/').at(-1)?.replace('.svx', '') ?? '';
    const index = parseInt(filename.split('-').at(0) ?? '0');
    const slug = filename.replace(/\d+-/, '');

    if (file && typeof file === 'object' && 'metadata' in file) {
        const metadata = file.metadata as LessonMetadata;
        const title = metadata.title;
        const toc = metadata.toc;
        const lockedUntil = metadata.lockedUntil ? new Date(metadata.lockedUntil) : undefined;
        const lesson: Lesson = { title, slug, index, toc, lockedUntil };
        return lesson;
    }
};
