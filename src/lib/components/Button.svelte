<script lang="ts">
    export let variant: 'primary' | 'secondary' | 'ghost' | 'invisible' = 'primary';
    export let href: string | undefined = undefined;
    export let disabled: boolean = false;
</script>

{#if href}
    <a {href} class={variant + ' button'} on:click>
        <slot>Button</slot>
    </a>
{:else}
    <button class={variant + ' button'} on:click {disabled}>
        <slot>Button</slot>
    </button>
{/if}

<style lang="scss">
    .button {
        display: flex;
        height: 2rem;
        min-width: max-content;
        background-color: transparent;
        border: none;
        align-items: center;
        justify-content: center;
        gap: var(--padding-sm);
        padding: var(--padding-md);
        border-radius: 1rem;
        transition: 300ms box-shadow ease, 300ms background-color ease, 300ms color ease;
        @include paragraph-sm-b;

        :global(img) {
            height: 1.25rem;
        }

        & {
            line-height: 1;
        }

        &:hover:not(:disabled) {
            cursor: pointer;
        }

        &.primary:not(:disabled) {
            background-color: var(--primary);
            color: var(--background);

            &:hover {
                box-shadow: var(--shadow-sm-medium);
            }

            &:active {
                box-shadow: var(--shadow-sm-heavy);
            }
        }

        &.secondary:not(:disabled) {
            background-color: var(--secondary);
            color: var(--background);

            &:hover {
                box-shadow: var(--shadow-sm-heavy);
            }

            &:active {
                box-shadow: var(--shadow-sm-black);
            }
        }

        &.ghost:not(:disabled) {
            &:hover {
                box-shadow: var(--shadow-sm-light);
            }

            &:active {
                box-shadow: var(--shadow-sm-medium);
            }
        }

        &.invisible:not(:disabled) {
            &:hover {
                text-decoration: underline;
            }
        }
    }

    a.button {
        text-decoration: none;
    }
</style>
