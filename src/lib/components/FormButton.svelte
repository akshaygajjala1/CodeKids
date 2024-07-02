<script lang="ts">
    export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
</script>

<button class={variant} on:click|preventDefault {...$$restProps}>
    <slot>
        Button
    </slot>
</button>

<style lang="scss">
    button {
        display: flex;
        width: 100%;
        height: 2.5rem;
        background-color: transparent;
        border: none;
        align-items: center;
        justify-content: center;
        gap: var(--padding-sm);
        padding: var(--padding-md);
        border-radius: 0.5rem;
        transition: 300ms box-shadow ease;

        @include paragraph-md-b;
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
</style>