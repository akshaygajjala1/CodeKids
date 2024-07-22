<div class="label">
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
        background: #F5E2FF;

        p {
            color: var(--text);
            text-align: center;
            @include paragraph-md-b;
        }
    }
</style>