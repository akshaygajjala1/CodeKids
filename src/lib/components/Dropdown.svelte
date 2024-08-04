<script lang="ts">
    import { fly } from 'svelte/transition';

    export let open: boolean;
</script>

{#if open}
    <div class="dropdown" transition:fly={{ y: '-1rem', duration: 300 }}>
        <slot />
    </div>
{/if}

<style lang="scss">
    .dropdown {
        position: absolute;
        top: calc(100% + var(--padding-sm));
        right: 0;
        min-width: 12rem;
        min-height: 2rem;
        background-color: var(--background);
        border-radius: 1rem;
        box-shadow: var(--shadow-sm-light);
        z-index: 10;

        :global(hr) {
            border-top: 1px solid var(--light-gray);
        }

        & > :global(*:first-child) {
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
        }

        & > :global(*:last-child) {
            border-bottom-left-radius: 1rem;
            border-bottom-right-radius: 1rem;
        }
    }
</style>
