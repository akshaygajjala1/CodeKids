<script lang="ts">
    import arrowSrc from '$lib/assets/icons/chevron_right.png';
    import { toUrlSafe } from '$lib/helpers/functions';
    import type { Course, Section, Lesson } from '../../../types';

    export let course: Course | null;
    export let section: Section | null;
    export let lesson: Lesson | null;
</script>

<nav class="breadcrumb">
    <p>
        <a href="/dashboard">Dashboard</a>
    </p>
    {#if course}
        <div class="link-container">
            <img src={arrowSrc} alt="arrow" />
            <p>
                <a href="/dashboard/{toUrlSafe(course.title)}">{course.title}</a>
            </p>
        </div>
        {#if section}
            <div class="link-container">
                <img src={arrowSrc} alt="arrow" />
                <p>
                    <a href="/dashboard/{toUrlSafe(course.title)}/{toUrlSafe(section.title)}"
                        >{section.title}</a
                    >
                </p>
            </div>
            {#if lesson && lesson.index > 0}
                <div class="link-container">
                    <img src={arrowSrc} alt="arrow" />
                    <p>
                        <a
                            href="/dashboard/{toUrlSafe(course.title)}/{toUrlSafe(
                                section.title
                            )}/{lesson.slug}">{lesson.title}</a
                        >
                    </p>
                </div>
            {/if}
        {/if}
    {/if}
</nav>

<style lang="scss">
    .breadcrumb {
        display: flex;
        align-items: center;
        gap: var(--padding-sm);
        flex-wrap: wrap;

        a {
            color: var(--primary);
            text-decoration: none;
        }

        p {
            margin: 0;
        }

        .link-container {
            display: flex;
            align-items: center;
            gap: var(--padding-sm);

            img {
                width: 1.6875rem;
                height: 1.6875rem;
                filter: brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(7360%)
                    hue-rotate(281deg) brightness(91%) contrast(105%);
            }
        }
    }
</style>
