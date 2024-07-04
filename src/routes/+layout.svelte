<script lang="ts">
    import { fade } from 'svelte/transition';

    import PageTransition from '$lib/components/PageTransition.svelte';
    import AuthTemplatePage from '$lib/components/auth/AuthTemplatePage.svelte';
    import '$lib/scss/global.scss';

    import type { LayoutData } from './$types';

    export let data: LayoutData;

    const authURLs = ['/login', '/signup', '/forgot-password', '/reset-password', '/confirmation'];

    const urlType = (url: string): string => {
        if (authURLs.includes(url)) {
            return 'auth';
        } else if (url.startsWith('/dashboard')) {
            return 'dashboard';
        }
        return 'home';
    };
</script>

{#key urlType(data.url)}
    <div in:fade={{ duration: 150, delay: 160 }} out:fade={{ duration: 150 }}>
        {#if authURLs.includes(data.url)}
            <AuthTemplatePage>
                {#key data.url}
                    <PageTransition>
                        <slot />
                    </PageTransition>
                {/key}
            </AuthTemplatePage>
        {:else}
            <slot />
        {/if}
    </div>
{/key}
