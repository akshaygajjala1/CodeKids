<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/components/Button.svelte';
    import { toUrlSafe } from '$lib/helpers/functions';
</script>

<div class="center-text">
    <h1>{$page.status}</h1>
    <p>{$page.error?.message}</p>
    <Button variant="secondary" href="/dashboard/{toUrlSafe($page.data.course.title ?? '')}"
        >Return to Course</Button
    >
</div>

<style lang="scss">
    .center-text {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--padding-md);
    }
</style>
