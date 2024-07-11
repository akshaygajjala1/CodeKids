<script lang="ts">
    import LogoText from '$lib/components/LogoText.svelte';
    import Logo from '$lib/components/Logo.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import CourseSelector from '$lib/components/dashboard/CourseSelector.svelte';
    import LessonItem from '$lib/components/dashboard/LessonItem.svelte';
    import Navigation from '$lib/components/dashboard/Navigation.svelte';
    import PageTransition from '$lib/components/PageTransition.svelte';
    import MenuToggle from '$lib/components/MenuToggle.svelte';
    import type { LayoutData } from './$types';
    import { toUrlSafe } from '$lib/helpers/functions';
    import { fade, slide } from 'svelte/transition';
    import Breadcrumb from '$lib/components/dashboard/Breadcrumb.svelte';

    export let data: LayoutData;
    let innerWidth;
    let menuActive = true;
    let isDesktop;
    let isMobile = false;

    const onResize = () => {
        const isNowDesktop =
            innerWidth / parseFloat(getComputedStyle(document.querySelector('html')!).fontSize) >
            64;
        if (isDesktop !== undefined && isDesktop !== isNowDesktop) {
            if (!isNowDesktop) {
                menuActive = false;
            } else {
                menuActive = true;
            }
        }
        isDesktop = isNowDesktop;
        isMobile =
            innerWidth / parseFloat(getComputedStyle(document.querySelector('html')).fontSize) > 25;
    };

    onMount(() => {
        onResize();
    })
</script>

<svelte:window bind:innerWidth on:resize={onResize} />

<div class="container">
    <nav>
        <MenuToggle bind:menuActive />
        {#if isMobile}
            <LogoText />
        {:else}
            <a href="/">
                <Logo />
            </a>
        {/if}
    </nav>
    <main>
        {#if menuActive}
            <aside class="contents" transition:slide={{ duration: 600, axis: 'x' }}>
                <div class="course-selector">
                    {#each data.courseContent as course (course.title)}
                        <CourseSelector
                            courseName={course.title}
                            courseIcon={`/courses/${course.title}.png`}
                            selected={data.path.startsWith(
                                `/dashboard/${course.title.toLowerCase()}`
                            )}
                        />
                    {/each}
                </div>
                <div class="transition-container">
                    {#key $page.data.course?.index}
                        <div class="transition" transition:fade={{ duration: 300 }}>
                            <div class="lesson-list">
                                {#if $page.data.course}
                                    {#each $page.data.course.sections as section}
                                        <div class="lesson-group">
                                            {#each section.lessons as lesson, i (lesson.index)}
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
                        </div>
                    {/key}
                </div>
            </aside>
        {/if}
        <article>
            {#key data.url}
                <PageTransition>
                    <div class="prose">
                        {#key $page.data.lesson}
                            {#if $page.data.content}
                                <Breadcrumb
                                    course={$page.data.course}
                                    section={$page.data.section}
                                    lesson={$page.data.lesson}
                                />
                            {/if}
                        {/key}
                        <slot />
                        <div class="spacer"></div>
                        {#key $page.data.lesson}
                            {#if $page.data.lesson}
                                <Navigation
                                    course={$page.data.course}
                                    section={$page.data.section}
                                    lesson={$page.data.lesson}
                                />
                            {/if}
                        {/key}
                    </div>
                </PageTransition>
            {/key}
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
            min-height: 3.75rem;
            width: 100%;
            background: var(--background);
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            padding: 0 var(--padding-md);
            gap: var(--padding-md);

            :global(#menu-button) {
                display: grid;
                margin-left: 0;
            }
        }

        main {
            position: relative;
            display: flex;
            flex: 1 0 0;
            width: 100%;
            overflow: hidden;
            gap: var(--padding-sm);

            .contents {
                display: flex;
                width: 20rem;
                padding: var(--padding-3xl);
                flex-direction: column;
                align-items: flex-start;
                gap: var(--padding-3xl);
                flex-shrink: 0;
                align-self: stretch;
                border-radius: 0.5rem;
                background: var(--background);
                overflow-y: auto;
                z-index: 1;

                @media screen and (max-width: 64rem) {
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    box-shadow: 0.25rem 0px 0.25rem rgba(0, 0, 0, 0.25);
                }

                & > * {
                    min-width: calc(20rem - 2 * var(--padding-3xl));
                }

                .course-selector {
                    display: flex;
                    flex-direction: column;
                    gap: var(--padding-md);
                }

                .transition-container,
                .transition {
                    width: 100%;
                }

                .transition-container {
                    display: grid;
                }

                .transition {
                    grid-column-start: 1;
                    grid-column-end: 2;
                    grid-row-start: 1;
                    grid-row-end: 2;
                }

                .lesson-list {
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    width: 100%;
                    margin: 0 -0.5rem;
                    gap: var(--padding-3xl);
                    padding-left: var(--padding-md);

                    :global(.lesson-group) {
                        display: flex;
                        flex-direction: column;
                    }

                    :global(.lesson-group a) {
                        width: calc(100% + 1rem);
                    }

                    :global(.lesson-group a:first-child) {
                        margin-left: -1rem;
                        width: calc(100% + 2rem);
                    }
                }
            }

            article {
                width: 100%;
                align-self: stretch;
                overflow-x: hidden;
                overflow-y: auto;
                padding: var(--page-padding);
                background: var(--background);
                border-radius: 0.5rem;
                display: grid;

                :global(.transition) {
                    height: auto;
                    width: 100%;
                    display: flex;
                }

                .prose {
                    height: auto;
                    min-height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    max-width: 60rem;
                    margin-right: auto;
                }

                .spacer {
                    flex-grow: 1;
                }
            }
        }
    }
</style>
