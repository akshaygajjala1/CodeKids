<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/components/Button.svelte';
    import Footer from '$lib/components/home/Footer.svelte';
    import HomeNavbar from '$lib/components/home/Navbar.svelte';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    const authURLs = ['/login', '/signup', '/forgot-password', '/reset-password', '/confirmation'];
</script>

{#if authURLs.includes(data.url)}
    <div class="container">
        <h1>{$page.status}</h1>
        <p>{$page.error?.message}</p>
        <Button variant="secondary" href="/">Return to Homepage</Button>
    </div>
{:else}
    <HomeNavbar />
    <div class="content">
        <div class="center-text">
            <h1>{$page.status}</h1>
            <p>{$page.error?.message}</p>
            <Button variant="secondary" href="/">Return to Homepage</Button>
        </div>
        <Footer hasReturnToTop={false} />
    </div>
{/if}

<style lang="scss">
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;

        .center-text {
            display: flex;
            flex: 1 0 0;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-top: 2.65rem;
            gap: var(--padding-md);

            h1 {
                @include title-md;
                line-height: 1;
            }
        }
    }
</style>
