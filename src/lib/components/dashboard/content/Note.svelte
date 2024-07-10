<script lang="ts">
    export let icon: 'info' | 'help' | 'warning' | 'error' | 'report' | 'dangerous';

    const iconSrc = `/icons/${icon}.png`;
</script>

<div class="note">
    <img src={iconSrc} alt={icon} />
    <p>
        <slot>Text</slot>
    </p>
</div>

<style lang="scss">
    .note {
        display: flex;
        padding: var(--padding-md);
        align-items: flex-start;
        gap: var(--padding-md);
        align-self: stretch;
        border-radius: 1rem;
        border: 2px solid var(--primary);

        img {
            width: 1.6875rem;
            height: 1.6875rem;
            filter: brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(7360%)
                hue-rotate(281deg) brightness(91%) contrast(105%);
        }

        p {
            color: var(--primary);
            margin: 0;
        }
    }
</style>
