<script lang="ts">
    import { fly } from 'svelte/transition';
</script>

<div
    class="transition"
    in:fly={{ x: 40, duration: 300, delay: 400 }}
    out:fly={{ x: -40, duration: 300 }}
>
    <slot />
</div>

<style lang="scss">
    .transition {
        height: 100%;
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 2;
    }
</style>
