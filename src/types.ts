export type LessonMetadata = {
    title: string;
    lockedUntil: string | undefined;
    toc: {
        text: string;
        orignal: string;
        depth: number;
    }[];
};

export type Lesson = {
    title: string;
    slug: string;
    index: number;
    lockedUntil: Date | undefined;
    toc: {
        text: string;
        orignal: string;
        depth: number;
    }[];
};

export type Section = {
    title: string;
    index: number;
    lessons: Lesson[];
    lockedUntil: Date | undefined;
};

export type Course = {
    title: string;
    default: Lesson;
    index: number;
    sections: Section[];
};
