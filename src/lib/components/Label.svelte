<script lang="ts">
    export let emphasized: boolean = false;
</script>

<div class="label {emphasized ? 'emphasized' : ''}">
    <p>
        <slot />
    </p>
</div>

<style lang="scss">
    .label {
        display: flex;
        padding: var(--padding-xs) var(--padding-smd);
        width: fit-content;
        justify-content: center;
        align-items: center;
        border-radius: 1rem;
        background: #f5e2ff;

        p {
            color: var(--text);
            text-align: center;
            @include paragraph-md-b;
        }

        &.emphasized {
            background: var(--primary);

            p {
                color: var(--background);
            }
        }
    }
</style>
