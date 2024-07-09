import { toTitleCase } from '$lib/helpers/functions';
import { getLesson } from '$lib/helpers/svx';
import * as fs from 'node:fs';
import type { Course, Section, Lesson } from '../../types';

const getDirectories = (path: string): string[] => {
    return fs.readdirSync(path).filter((file) => fs.statSync(`${path}/${file}`).isDirectory());
};

export const getContent = async (): Promise<Course[]> => {
    let courses: Course[] = [];

    const courseDirs = getDirectories('./src/content/');
    for (const courseDir of courseDirs) {
        let sections: Section[] = [];

        const sectionDirs = getDirectories(`./src/content/${courseDir}`);
        for (const sectionDir of sectionDirs) {
            let lessons: Lesson[] = [];

            const dirPath = `./src/content/${courseDir}/${sectionDir}/`;
            const lessonFiles = fs.readdirSync(dirPath).filter((file) => file.endsWith('.svx'));
            lessonFiles.forEach(async (lessonFile) => {
                const fileName = lessonFile.split('.svx')[0];
                const lesson = getLesson(
                    await import(`../../content/${courseDir}/${sectionDir}/${fileName}.svx`),
                    lessonFile
                );
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
        const getDefault = await import(`../../content/${courseDir}/index.svx`);
        const defaultLesson = getLesson(getDefault, 'index.svx') ?? {
            title: '',
            slug: '',
            index: 0
        };
        const course: Course = { title: courseName, default: defaultLesson, sections, index };
        courses.push(course);
    }

    courses.sort((a, b) => a.index - b.index);
    return courses;
};
