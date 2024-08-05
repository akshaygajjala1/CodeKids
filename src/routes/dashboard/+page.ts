import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const welcome = await import('../../content/welcome.svx');
    // const lesson = getLesson(welcome, `welcome.svx`)!;

    return {
        content: welcome.default
        // lesson
    };
};
