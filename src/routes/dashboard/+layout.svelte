<script lang="ts">
    import LogoText from '$lib/components/LogoText.svelte';
    import Logo from '$lib/components/Logo.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { beforeNavigate, afterNavigate } from '$app/navigation';
    import CourseSelector from '$lib/components/dashboard/CourseSelector.svelte';
    import LessonItem from '$lib/components/dashboard/LessonItem.svelte';
    import Navigation from '$lib/components/dashboard/Navigation.svelte';
    import PageTransition from '$lib/components/PageTransition.svelte';
    import MenuToggle from '$lib/components/MenuToggle.svelte';
    import type { LayoutData } from './$types';
    import { toUrlSafe } from '$lib/helpers/functions';
    import { fade, slide } from 'svelte/transition';
    import Breadcrumb from '$lib/components/dashboard/Breadcrumb.svelte';
    import Button from '$lib/components/Button.svelte';

    import closeIconSrc from '$lib/assets/icons/close.png';
    import downArrowSrc from '$lib/assets/icons/keyboard_arrow_down.png';
    import accountIconSrc from '$lib/assets/icons/account_circle.png';
    import Dropdown from '$lib/components/Dropdown.svelte';
    import DropdownItem from '$lib/components/DropdownItem.svelte';
    import { enhance } from '$app/forms';

    export let data: LayoutData;
    let innerWidth: number;
    let menuActive = true;
    let accountDropdownOpen = false;
    let isMobile = false;
    let observer: IntersectionObserver;
    let collapseToc: boolean = false;
    let showToc: boolean = true;
    let containerHeight: number;

    const pxToRem = (px: number) => {
        return px / parseFloat(getComputedStyle(document.querySelector('html')!).fontSize);
    };

    const registerTocLinks = () => {
        const inThisLessonLink = document.querySelector('#in-this-lesson-link')! as HTMLElement;
        if (inThisLessonLink) inThisLessonLink.style.display = collapseToc ? 'inline' : 'none';
        const inThisLessonButton = document.querySelector('#in-this-lesson-button')! as HTMLElement;
        if (inThisLessonButton) {
            inThisLessonButton.onclick = () => {
                showToc = !showToc;
            };
        }
    };

    const setProseHeight = () => {
        const prose = document.querySelector('.prose')! as HTMLElement;
        if (prose) {
            containerHeight = prose.getBoundingClientRect().height;
        }
    };

    const onResize = () => {
        // const isNowDesktop = pxToRem(innerWidth) > 64;
        // if (isDesktop !== undefined && isDesktop !== isNowDesktop) {
        //     if (!isNowDesktop) {
        //         menuActive = false;
        //     } else {
        //         menuActive = true;
        //     }
        // }
        // isDesktop = isNowDesktop;
        isMobile = pxToRem(innerWidth) < 38;

        const scrollContainer = document.querySelector('#content-container')! as HTMLElement;
        collapseToc = pxToRem(scrollContainer.getBoundingClientRect().width) < 64;
        if (!collapseToc) {
            showToc = true;
        }
        registerTocLinks();
        setProseHeight();
    };

    const indexOfEntry = (target: Element) => {
        if (!$page.data.lesson) {
            return;
        }

        const heading = $page.data.lesson.toc.find((heading: { text: string }) => {
            return heading.text === target.id;
        });
        return $page.data.lesson.toc.indexOf(heading);
    };

    const onScrollContainerScroll = (event: Event) => {
        const { scrollHeight, scrollTop, clientHeight } = event.target! as HTMLElement;
        const scrollContainer = document.querySelector('#content-container')! as HTMLElement;

        if (Math.abs(scrollHeight - clientHeight - scrollTop) <= 5) {
            if (!$page.data.lesson?.toc) {
                return;
            }
            scrollContainer.style.setProperty(
                '--contents-tracker',
                ($page.data.lesson.toc.length - 1).toString()
            );
        }
    };

    const observe = () => {
        if ($page.data.lesson?.toc) {
            const scrollContainer = document.querySelector('#content-container')! as HTMLElement;
            scrollContainer.addEventListener('scroll', onScrollContainerScroll);

            observer = new IntersectionObserver(
                ([entry]) => {
                    if (!$page.data.lesson) {
                        return;
                    }

                    const containerRect = scrollContainer.getBoundingClientRect();
                    if (
                        entry.isIntersecting &&
                        entry.boundingClientRect.top < containerRect.top + containerRect.height / 2
                    ) {
                        const index = indexOfEntry(entry.target);
                        scrollContainer.style.setProperty(
                            '--contents-tracker',
                            (index - 1).toString()
                        );
                    } else if (
                        entry.boundingClientRect.top <
                        containerRect.top + containerRect.height / 2
                    ) {
                        const index = indexOfEntry(entry.target);
                        scrollContainer.style.setProperty('--contents-tracker', index.toString());
                    } else if (entry.isIntersecting) {
                        const index = indexOfEntry(entry.target);
                        if (
                            index === $page.data.lesson.toc.length - 1 &&
                            parseInt(
                                scrollContainer.style.getPropertyValue('--contents-tracker')
                            ) ===
                                $page.data.lesson.toc.length - 2
                        ) {
                            scrollContainer.style.setProperty(
                                '--contents-tracker',
                                index.toString()
                            );
                        }
                    } else {
                        const index = indexOfEntry(entry.target);
                        if (
                            index === $page.data.lesson.toc.length - 1 &&
                            parseInt(
                                scrollContainer.style.getPropertyValue('--contents-tracker')
                            ) ===
                                $page.data.lesson.toc.length - 1
                        ) {
                            scrollContainer.style.setProperty(
                                '--contents-tracker',
                                (index - 1).toString()
                            );
                        }
                    }
                },
                {
                    root: scrollContainer,
                    threshold: 1,
                    rootMargin: '-84px 0px -84px 0px'
                }
            );

            $page.data.lesson.toc.forEach(
                (heading: { text: string; original: string; depth: 2 | 3 }) => {
                    observer.observe(document.querySelector(`#${heading.text}`)!);
                }
            );

            return () => {
                observer.disconnect();
            };
        }
    };

    const beforePageTransition = (e: Event) => {
        const el = e?.target as HTMLElement;
        el.style.maxHeight = `${containerHeight}px`;
        el.style.maxWidth = `${el.getBoundingClientRect().width}px`;
    };

    const afterPageTransition = () => {
        const el = document.querySelector('.prose-container > .transition')! as HTMLElement;
        el.style.removeProperty('max-height');
        el.style.removeProperty('max-width');
    };

    onMount(() => {
        onResize();
        observe();
    });

    beforeNavigate((navigation) => {
        if (navigation.to?.route.id) {
            const scrollContainer = document.getElementById('content-container')!;
            scrollContainer.style.setProperty('--contents-tracker', '-1');
            scrollContainer.removeEventListener('scroll', onScrollContainerScroll);

            if (observer && $page.data.lesson?.toc) {
                $page.data.lesson.toc.forEach(
                    (heading: { text: string; original: string; depth: 2 | 3 }) => {
                        observer.unobserve(document.querySelector(`#${heading.text}`)!);
                    }
                );
            }
        }
    });

    afterNavigate(() => {
        if ($page.url.hash) {
            const element = document.getElementById($page.url.hash.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: 'instant' });
            }

            if ($page.data.lesson.toc) {
                setTimeout(() => {
                    const scrollContainer = document.getElementById('content-container')!;
                    const index = indexOfEntry(document.querySelector($page.url.hash)!);
                    scrollContainer.style.setProperty('--contents-tracker', index.toString());
                }, 400);
            }
        }

        setTimeout(() => {
            afterPageTransition();
        }, 1000);
        // setTimeout(() => {
        //     registerTocLinks();
        //     observe();
        //     setProseHeight();
        // }, 300);
        // setTimeout(() => {
        //     registerTocLinks();
        // }, 600);
    });
</script>

<svelte:window bind:innerWidth on:resize={onResize} />

<div class="container">
    <nav>
        <div class="left">
            <MenuToggle bind:menuActive />
            {#if isMobile}
                <a href="/">
                    <Logo />
                </a>
            {:else}
                <LogoText />
            {/if}
        </div>
        <div class="account-dropdown">
            <Button variant="ghost" on:click={() => (accountDropdownOpen = !accountDropdownOpen)}>
                <img src={accountIconSrc} alt="Account" />
                My Account
                <img
                    src={downArrowSrc}
                    alt="Dropdown"
                    class="arrow {accountDropdownOpen ? 'open' : ''}"
                />
            </Button>
            <Dropdown open={accountDropdownOpen}>
                <DropdownItem disabled>
                    {data.name}
                </DropdownItem>
                <DropdownItem href="/dashboard" on:click={() => (accountDropdownOpen = false)}>
                    Dashboard
                </DropdownItem>
                <DropdownItem href="/" on:click={() => (accountDropdownOpen = false)}>
                    Home
                </DropdownItem>
                <DropdownItem form="logout" on:click={() => (accountDropdownOpen = false)}>
                    <span style="color: var(--error);">Log out</span>
                </DropdownItem>
            </Dropdown>
            <form id="logout" action="/?/logout" method="POST" use:enhance></form>
        </div>
    </nav>
    <main>
        {#if menuActive}
            <aside
                class="contents"
                transition:slide={{ duration: 600, axis: 'x' }}
                on:outroend={onResize}
                on:introend={onResize}
            >
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
                        <div
                            class="transition"
                            in:fade={{ duration: 300, delay: 400 }}
                            out:fade={{ duration: 300 }}
                        >
                            <div class="lesson-list">
                                {#if $page.data.course}
                                    {#each $page.data.course.sections as section}
                                        <div class="lesson-group">
                                            {#each section.lessons as lesson, i (lesson.index)}
                                                <LessonItem
                                                    text={lesson.title}
                                                    current={data.path.endsWith(
                                                        `/${toUrlSafe(section.title)}${i !== 0 ? `/${lesson.slug}` : ''}`
                                                    )}
                                                    href={`/dashboard/${toUrlSafe($page.data.course.title)}/${toUrlSafe(section.title)}${i !== 0 ? `/${lesson.slug}` : ''}`}
                                                    locked={section.lockedUntil &&
                                                        section.lockedUntil.getTime() > Date.now()}
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
        <article id="content-container" style="--contents-tracker: -1;">
            <div class="lesson-contents-container">
                <div class="lesson-container">
                    <div class="prose-container">
                        {#key data.url}
                            <PageTransition
                                on:outroend={(e) => {
                                    const scrollContainer =
                                        document.getElementById('content-container');
                                    scrollContainer?.scroll({ top: 0, behavior: 'instant' });
                                    setTimeout(() => {
                                        beforePageTransition(e);
                                        registerTocLinks();
                                        observe();
                                        setProseHeight();
                                    }, 110);
                                }}
                                on:introend={(e) => {
                                    setTimeout(() => {
                                        beforePageTransition(e);
                                        registerTocLinks();
                                        observe();
                                        setProseHeight();
                                    }, 100);
                                }}
                            >
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
                    </div>
                    <div
                        class="toc-transition-container"
                        style={collapseToc ? 'position: absolute' : ''}
                    >
                        {#key $page.data.lesson}
                            <div class="toc-transition" transition:fade={{ duration: 300 }}>
                                {#if $page.data.lesson?.toc}
                                    <div
                                        class="wrap"
                                        style={collapseToc ? 'position: absolute' : ''}
                                    >
                                        {#if showToc}
                                            <aside
                                                class={collapseToc ? 'collapsed' : ''}
                                                transition:slide={{ axis: 'x' }}
                                            >
                                                <div class="in-this-lesson">
                                                    <p>In this lesson</p>
                                                    {#each $page.data.lesson.toc as heading}
                                                        <p class="depth-{heading.depth}">
                                                            <span title={heading.original}>
                                                                <a href={`#${heading.text}`}
                                                                    >{heading.original}</a
                                                                >
                                                            </span>
                                                        </p>
                                                    {/each}
                                                </div>
                                            </aside>
                                            <button
                                                id="toc-close-button"
                                                on:click={() => (showToc = false)}
                                                transition:fade={{ duration: 200 }}
                                                style={!collapseToc ? 'display: none' : ''}
                                            >
                                                <img src={closeIconSrc} alt="Close" />
                                            </button>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {/key}
                    </div>
                </div>
            </div>
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
            justify-content: space-between;
            align-items: center;
            padding: 0 var(--padding-md);
            gap: var(--padding-md);

            .left {
                display: flex;
                gap: var(--padding-md);
            }

            :global(#menu-button) {
                display: grid;
                margin-left: 0;
            }

            .account-dropdown {
                position: relative;

                & > :global(button > img) {
                    filter: brightness(0);
                }

                :global(img.arrow) {
                    transition: transform 300ms ease;
                }

                :global(img.arrow.open) {
                    transform: rotate(180deg);
                }
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
                max-width: calc(100vw - 2 * var(--padding-sm));
                padding: var(--padding-3xl);
                flex-direction: column;
                align-items: flex-start;
                gap: var(--padding-3xl);
                flex-shrink: 0;
                align-self: stretch;
                border-radius: 0.5rem;
                background: var(--background);
                overflow-y: auto;
                z-index: 3;

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
                scroll-behavior: smooth;
                padding: var(--page-padding);
                background: var(--background);
                border-radius: 0.5rem;
                display: grid;

                .lesson-contents-container {
                    height: auto;
                    width: 100%;
                    max-width: 88rem;
                    margin: 0 auto;
                    display: flex;
                }

                // :global(.transition.is-animating aside) {
                //     padding-top: 0 !important;
                // }

                .lesson-container {
                    width: 100%;
                    max-width: 70rem;
                    display: flex;
                    gap: 4rem;
                    margin-left: auto;

                    .prose-container {
                        width: 100%;
                        height: auto;
                        display: grid;

                        :global(.transition) {
                            width: 100%;
                            height: 100%;
                            display: flex;
                        }

                        // :global(.transition.animating-out) {
                        //     max-height: calc(100vh - 3 * var(--padding-sm) - 2 * var(--page-padding) - 3.75rem);
                        // }

                        .prose {
                            height: auto;
                            min-height: 100%;
                            width: 100%;
                            display: flex;
                            flex-direction: column;

                            .spacer {
                                flex: 1 0 0;
                            }
                        }
                    }

                    .toc-transition-container {
                        display: grid;

                        .toc-transition {
                            grid-row-start: 1;
                            grid-row-end: 2;
                            grid-column-start: 1;
                            grid-column-end: 2;
                        }
                    }

                    .wrap {
                        min-width: 14rem;
                        margin-top: calc(-1 * var(--page-padding));

                        aside {
                            position: fixed;
                            width: 14rem;
                            height: calc(100vh - (3 * var(--padding-sm) + 3.75rem));
                            top: 0;
                            margin-top: calc(2 * var(--padding-sm) + 3.75rem);
                            padding-top: var(--page-padding);
                            padding-left: var(--padding-3xl);
                            padding-bottom: var(--padding-sm);
                            margin-bottom: var(--padding-sm);
                            overflow-y: hidden;
                            display: grid;

                            &.collapsed {
                                right: var(--padding-sm);
                                background: var(--background);
                                border-radius: 0.5rem;
                                box-shadow: -0.25rem 0px 0.25rem rgba(0, 0, 0, 0.125);
                            }

                            .in-this-lesson {
                                position: relative;
                                min-width: 12rem;
                                width: 12rem;
                                padding-left: var(--padding-md);
                                padding-bottom: var(--page-padding);
                                display: flex;
                                flex-direction: column;
                                overflow-y: auto;

                                p {
                                    position: relative;
                                    padding: var(--padding-xs) 0;
                                    height: 1.8125rem;
                                    text-wrap: nowrap;
                                    @include paragraph-sm;

                                    span {
                                        display: block;
                                        overflow-x: auto;
                                        scrollbar-width: none;
                                        padding-right: 0.5rem;

                                        &::-webkit-scrollbar {
                                            width: 0;
                                            height: 0;
                                        }
                                    }

                                    a {
                                        text-decoration: none;
                                    }

                                    &::before {
                                        content: '';
                                        display: inline-block;
                                        position: absolute;
                                        top: calc(-1 * var(--padding-xs));
                                        left: calc(-1 * var(--padding-md));
                                        width: 1px;
                                        height: calc(100% + var(--padding-xs));
                                        background-color: var(--light-gray);
                                    }

                                    &::after {
                                        position: absolute;
                                        content: '';
                                        top: 0;
                                        right: 0;
                                        bottom: 0;
                                        width: 0.5rem;
                                        background: linear-gradient(
                                            to right,
                                            transparent,
                                            var(--background)
                                        );
                                    }

                                    &.depth-3 {
                                        padding-left: var(--padding-md);
                                    }
                                }

                                p:first-child {
                                    @include paragraph-sm-b;

                                    & {
                                        color: black;
                                    }
                                }

                                &::before {
                                    content: '';
                                    position: absolute;
                                    top: calc(1.8125rem * (var(--contents-tracker, 0) + 1));
                                    left: 0;
                                    height: 1.8125rem;
                                    width: 2px;
                                    border-radius: 1px;
                                    background-color: var(--primary);
                                    opacity: calc(var(--contents-tracker, -1) + 1);
                                    transition:
                                        300ms top ease,
                                        300ms opacity ease;
                                }
                            }
                        }

                        button {
                            position: fixed;
                            cursor: pointer;
                            width: 1.5rem;
                            height: 1.5rem;
                            top: var(--padding-sm);
                            margin-top: calc(2 * var(--padding-sm) + 3.75rem);
                            margin-right: var(--padding-sm);
                            right: var(--padding-sm);
                            background: transparent;
                            border: none;
                            padding: 0;
                            border-radius: 0.5rem;
                            display: grid;
                            place-items: center;

                            img {
                                filter: brightness(0) contrast(50%);
                            }
                        }
                    }
                }
            }
        }
    }
</style>
