<script lang="ts">
	import Button from "./Button.svelte";

    export let loggedIn: boolean;
</script>

<div class="container">
    {#if loggedIn}
        <Button href='/dashboard'>Open Dashboard</Button>
    {:else}
        <Button variant='ghost' href='/login'>Log In</Button>
        <Button variant='secondary' href='/signup'>Sign Up</Button>
    {/if}
</div>

<style lang="scss">
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--padding-smd);
    }
</style>
