<script lang="ts">
    export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
    export let href: string | undefined = undefined;
</script>

{#if href}
    <a {href} class={variant + ' button'} on:click>
        <slot>Button</slot>
    </a>
{:else}
    <button class={variant + ' button'} on:click>
        <slot>Button</slot>
    </button>
{/if}

<style lang="scss">
    .button {
        display: flex;
        height: 2rem;
        background-color: transparent;
        border: none;
        align-items: center;
        justify-content: center;
        gap: var(--padding-sm);
        padding: var(--padding-md);
        border-radius: 1rem;
        transition: 300ms box-shadow ease;

        @include paragraph-sm-b;
        line-height: 1;

        &:hover {
            cursor: pointer;
        }

        &.primary {
            background-color: var(--primary);
            color: var(--background);

            &:hover {
                box-shadow: var(--shadow-sm-medium);
            }

            &:active {
                box-shadow: var(--shadow-sm-heavy);
            }
        }

        &.secondary {
            background-color: var(--secondary);
            color: var(--background);

            &:hover {
                box-shadow: var(--shadow-sm-heavy);
            }

            &:active {
                box-shadow: var(--shadow-sm-black);
            }
        }

        &.ghost {
            &:hover {
                box-shadow: var(--shadow-sm-light);
            }

            &:active {
                box-shadow: var(--shadow-sm-medium);
            }
        }
    }

    a.button {
        text-decoration: none;
    }
</style>
