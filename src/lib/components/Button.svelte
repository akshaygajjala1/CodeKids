<script lang="ts">
    export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
</script>

<button class={variant}>
    <slot>
        Button
    </slot>
</button>

<style lang="scss">
    button {
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

        :global(a) {
            text-decoration: none;
            color: inherit;

            &:visited {
                color: inherit;
            }
        }

        &:hover {
            cursor: pointer;
        }

        &.primary {
            background-color: var(--primary);
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
</style>