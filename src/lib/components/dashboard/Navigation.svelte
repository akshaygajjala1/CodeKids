<script lang="ts">
    import { toUrlSafe } from '$lib/helpers/functions';
    import type { Course, Section, Lesson } from '../../../types';

    import backIconUrl from '$lib/assets/icons/arrow_back.png';
    import forwardIconUrl from '$lib/assets/icons/arrow_forward.png';

    export let course: Course | undefined;
    export let section: Section | undefined;
    export let lesson: Lesson;
    export let showForward: boolean = true;

    let backLink: string | null;
    let backText: string | null;
    let forwardLink: string | null;
    let forwardText: string | null;

    if (!course) {
        // do not show a backlink
    } else if (!section) {
        backLink = `/dashboard`;
        backText = 'Dashboard';
    } else {
        if (section.index === 0 && lesson.index === 0) {
            backLink = `/dashboard/${toUrlSafe(course.title)}`;
            backText = course.title;
        } else if (lesson.index === 0) {
            const prevSection = course.sections[section.index - 1];
            const prevLesson = prevSection.lessons[prevSection.lessons.length - 1];
            backLink = `/dashboard/${toUrlSafe(course.title)}/${toUrlSafe(prevSection.title)}/${
                prevLesson.slug
            }`;
            backText = prevLesson.title;
        } else {
            const prevLesson = section.lessons[lesson.index - 1];
            backLink = `/dashboard/${toUrlSafe(course.title)}/${toUrlSafe(section.title)}/${
                prevLesson.slug
            }`;
            backText = prevLesson.title;
        }
    }

    if (!course) {
        // do not show a forward link
    } else if (!section) {
        forwardLink = `/dashboard/${toUrlSafe(course.title)}/${toUrlSafe(course.sections[0].title)}`;
        forwardText = course.sections[0].title;
    } else {
        if (
            section.index === course.sections.length - 1 &&
            lesson.index === section.lessons.length - 1
        ) {
            forwardLink = null;
            forwardText = null;
        } else if (lesson.index === section.lessons.length - 1) {
            const nextSection = course.sections[section.index + 1];
            const nextLesson = nextSection.lessons[0];
            forwardLink = `/dashboard/${toUrlSafe(course.title)}/${toUrlSafe(nextSection.title)}/${
                nextLesson.slug
            }`;
            forwardText = nextLesson.title;
        } else {
            const nextLesson = section.lessons[lesson.index + 1];
            forwardLink = `/dashboard/${toUrlSafe(course.title)}/${toUrlSafe(section.title)}/${
                nextLesson.slug
            }`;
            forwardText = nextLesson.title;
        }
    }
</script>

<nav>
    {#if backLink}
        <div class="back">
            <a href={backLink}>
                <img src={backIconUrl} alt="Back" />
                <p>{backText}</p>
            </a>
        </div>
    {/if}
    {#if showForward && forwardLink}
        <div class="forward">
            <a href={forwardLink}>
                <p>{forwardText}</p>
                <img src={forwardIconUrl} alt="Forward" />
            </a>
        </div>
    {/if}
</nav>

<style lang="scss">
    nav {
        display: flex;
        width: 100%;
        align-items: center;
        margin-top: 3rem;
        justify-content: space-between;
        gap: var(--padding-3xl);
        flex-wrap: wrap;

        div {
            display: flex;

            a {
                width: fit-content;
                display: flex;
                gap: var(--padding-xs);
                text-decoration: none;
                align-items: center;

                img {
                    width: 1.6875rem;
                    height: 1.6875rem;
                    filter: brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(7360%)
                        hue-rotate(281deg) brightness(91%) contrast(105%);
                }

                p {
                    color: var(--primary);
                    margin: 0;
                }
            }

            &.forward {
                margin-left: auto;
                justify-content: flex-end;
            }
        }
    }
</style>
