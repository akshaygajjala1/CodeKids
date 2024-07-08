import { toTitleCase } from '$lib/helpers/functions';
import * as fs from 'node:fs';

export type Lesson = {
    title: string;
    slug: string;
    index: number;
}

export type Section = {
    title: string;
    index: number;
    lessons: Lesson[];
}

export type Course = {
    title: string;
    default: Lesson;
    index: number;
    sections: Section[];
}

const getDirectories = (path: string): string[] => {
    return fs.readdirSync(path).filter((file) => fs.statSync(`${path}/${file}`).isDirectory());
}

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

export const getContent = async (): Promise<Course[]> => {
    let courses: Course[] = [];

    const courseDirs = getDirectories('./src/content/');
    for (const courseDir of courseDirs) {
        let sections: Section[] = [];

        const sectionDirs = getDirectories(`./src/content/${courseDir}`);
        for (const sectionDir of sectionDirs) {
            let lessons: Lesson[] = [];

            const dirPath = `./src/content/${courseDir}/${sectionDir}`;
            const lessonFiles = fs.readdirSync(dirPath).filter((file) => file.endsWith('.svx'));
            lessonFiles.forEach( async (lessonFile) => {
                const lesson = getLesson(await import(/* @vite-ignore */ `../../../${dirPath}/${lessonFile}`), lessonFile);
                if (lesson) lessons.push(lesson);
            });

            lessons.sort((a, b) => a.index - b.index);
            const sectionName = toTitleCase(sectionDir.replace(/\d+-/, '').replace(/-/g, ' '));
            const index = parseInt(sectionDir.split('-')[0] ?? '');
            const section: Section = { title: sectionName, lessons, index };
            sections.push(section);
        }

        sections.sort((a, b) => a.index - b.index);
        const courseName = toTitleCase(courseDir.replace(/\d+-/, '').replace(/-/g, ' '));
        const index = parseInt(courseDir.split('-')[0] ?? '');
        const path = `./src/content/${courseDir}/index.svx`;
        const getDefault = await import(/* @vite-ignore */ `../../../${path}`)
        const defaultLesson = getLesson(getDefault, path) ?? { title: '', slug: '', index: 0 };
        const course: Course = { title: courseName, default: defaultLesson, sections, index }
        courses.push(course);
    }

    courses.sort((a, b) => a.index - b.index);
    return courses;
}