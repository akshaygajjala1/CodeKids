<script lang="ts">
    export let href: string | undefined = undefined;
    export let disabled: boolean = false;
</script>

{#if href}
    <a {href} class="dropdown-item" on:click aria-disabled={disabled} {...$$restProps}>
        <slot />
    </a>
{:else}
    <button class="dropdown-item" on:click {disabled} aria-disabled={disabled} {...$$restProps}>
        <slot />
    </button>
{/if}

<style lang="scss">
    .dropdown-item {
        display: block;
        width: 100%;
        height: 2rem;
        padding: 0 var(--padding-md);
        background-color: var(--background);
        text-align: left;
        border: none;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        @include paragraph-sm-b;

        &[aria-disabled='true'] {
            color: var(--gray);
        }

        &[aria-disabled='false'] {
            cursor: pointer;

            &:hover {
                background-color: rgb(240, 240, 240);
            }
        }
    }
</style>
