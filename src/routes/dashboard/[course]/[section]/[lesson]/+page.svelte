<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

{#if data.locked && !data.admin}
    <svelte:component this={data.content}>
        <h1>{data.lessonTitle}</h1>
        <p>
            This lesson is locked until {data.lockedUntil?.toLocaleDateString()} at {data.lockedUntil?.toLocaleTimeString()}.
        </p>
    </svelte:component>
{:else}
    <svelte:component this={data.content} />
{/if}
