<script lang="ts">
    import LogoText from '$lib/components/LogoText.svelte';
    import { page } from '$app/stores';
    import CourseSelector from '$lib/components/dashboard/CourseSelector.svelte';
    import LessonItem from '$lib/components/dashboard/LessonItem.svelte';
    import type { LayoutData } from './$types';
    import { toUrlSafe } from '$lib/helpers/functions';

    export let data: LayoutData;
</script>

<div class="container">
    <nav>
        <LogoText />
    </nav>
    <main>
        <aside class="contents">
            <div class="course-selector">
                {#each data.content as course (course.title)}
                    <CourseSelector
                        courseName={course.title}
                        courseIcon={`/courses/${course.title}.png`}
                        selected={data.path.startsWith(`/dashboard/${course.title.toLowerCase()}`)}
                    />
                {/each}
            </div>
            <div class="lesson-list">
                {#if $page.data.course}
                    {#each $page.data.course.sections as section}
                        <div class="lesson-group">
                            {#each section.lessons as lesson, i}
                                <LessonItem
                                    text={lesson.title}
                                    current={data.path.endsWith(
                                        `/${lesson.title.toLowerCase().replaceAll(' ', '-')}`
                                    )}
                                    href={`/dashboard/${toUrlSafe($page.data.course.title)}/${toUrlSafe(section.title)}${i !== 0 ? `/${lesson.slug}` : ''}`}
                                />
                            {/each}
                        </div>
                    {/each}
                {/if}
            </div>
        </aside>
        <article>
            <slot />
        </article>
    </main>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--padding-sm);
        gap: var(--padding-sm);
        width: 100%;
        height: 100vh;
        background: linear-gradient(to right top, #9309de 0%, rgba(147, 9, 222, 0.5) 100%),
            var(--colors-background, #fff);

        nav {
            height: 3.75rem;
            width: 100%;
            background: var(--background);
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            padding: 0 var(--padding-md);
        }

        main {
            display: flex;
            width: 100%;
            height: 100%;
            gap: var(--padding-sm);

            .contents {
                display: flex;
                width: 20rem;
                padding: var(--page-padding);
                flex-direction: column;
                align-items: flex-start;
                gap: var(--padding-3xl);
                flex-shrink: 0;
                align-self: stretch;
                border-radius: 0.5rem;
                background: var(--background);
                overflow: auto;

                .course-selector {
                    display: flex;
                    flex-direction: column;
                    gap: var(--padding-md);
                }

                .lesson-list {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    margin: 0 -0.5rem;
                    gap: var(--padding-3xl);
                    padding-left: var(--padding-md);

                    :global(.lesson-group) {
                        display: flex;
                        flex-direction: column;
                    }

                    :global(.lesson-group a:first-child) {
                        margin-left: -1rem;
                        width: calc(100% + 1rem);
                    }
                }
            }

            article {
                width: 100%;
                height: 100%;
                padding: var(--page-padding);
                background: var(--background);
                border-radius: 0.5rem;
            }
        }
    }
</style>
