export type Lesson = {
    title: string;
    slug: string;
    index: number;
};

export type Section = {
    title: string;
    index: number;
    lessons: Lesson[];
};

export type Course = {
    title: string;
    default: Lesson;
    index: number;
    sections: Section[];
};
