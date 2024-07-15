<script lang="ts">
    export let text: string;
    export let current: boolean = false;
    export let href: string;
</script>

<a class="text-container" {href}>
    <p class={current ? 'current' : ''}>{text}</p>
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
            color: var(--colors-gray, #565656);
            @include paragraph-xl;

            &.current {
                color: var(--colors-dark-gray, #383838);
                @include paragraph-xl-b;
            }
        }
    }
</style>
