<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/components/Button.svelte';
</script>

<div class="center-text">
    <h1>{$page.status}</h1>
    <p>{$page.error?.message}</p>
    <Button variant="secondary" href="/dashboard">Return to Dashboard</Button>
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
