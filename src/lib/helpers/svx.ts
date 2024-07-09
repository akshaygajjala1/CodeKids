import type { Lesson } from "../../types";

export const getLesson = (file: unknown, name: string): Lesson | void => {
    const filename = name.split('/').at(-1)?.replace('.svx', '') ?? '';
    const index = parseInt(filename.split('-').at(0) ?? '0');
    const slug = filename.replace(/\d+-/, '');

    if (file && typeof file === 'object' && 'metadata' in file) {
        const metadata = file.metadata as { title: string };
        const title = metadata.title;
        const lesson: Lesson = { title, slug, index };
        return lesson;
    }
}