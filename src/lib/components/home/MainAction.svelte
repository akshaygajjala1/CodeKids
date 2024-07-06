<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '../Button.svelte';

    export let loggedIn: boolean;
    export let hideSignOut: boolean = false;
</script>

<div class="container">
    {#if loggedIn}
        {#if !hideSignOut}
            <form method="POST" action="/?/logout" use:enhance>
                <Button variant="ghost">Log out</Button>
            </form>
        {/if}
        <Button href="/dashboard">Open Dashboard</Button>
    {:else}
        <Button variant="ghost" href="/login">Log In</Button>
        <Button href="/signup">Sign Up</Button>
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
