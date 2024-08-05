<script lang="ts">
    export let text: string;
    export let current: boolean = false;
    export let href: string;
    export let locked: boolean = false;

    import lockSrc from '$lib/assets/icons/lock.png';
</script>

<a class="text-container {locked ? 'locked' : ''}" {href}>
    <p class:current>{text}</p>
    {#if locked}
        <img class:current src={lockSrc} alt="Locked" />
    {/if}
</a>

<style lang="scss">
    .text-container {
        display: flex;
        width: 100%;
        height: 2.5rem;
        padding: 0rem var(--padding-sm, 0.5rem);
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        border-radius: 0.5rem;
        text-decoration: none;
        transition: 300ms box-shadow ease;

        &:hover {
            box-shadow: var(--shadow-sm-medium);
            cursor: pointer;
        }

        p {
            display: flex;
            height: 1.597rem;
            flex-direction: column;
            justify-content: center;
            flex: 1 0 0;
            color: var(--gray, #565656);
            @include paragraph-xl;

            &.current {
                color: var(--dark-gray, #383838);
                @include paragraph-xl-b;
            }
        }

        img {
            width: 1.25rem;
            height: 1.25rem;
            filter: brightness(0) saturate(100%) invert(86%) sepia(0%) saturate(1%)
                hue-rotate(196deg) brightness(96%) contrast(87%);

            &.current {
                filter: brightness(0) saturate(100%);
            }
        }
    }
</style>
