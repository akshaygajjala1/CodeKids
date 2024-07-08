<script lang="ts">
    import LogoText from '$lib/components/LogoText.svelte';
</script>

<div class="container">
    <nav>
        <LogoText />
    </nav>
    <main>
        <aside class="contents"></aside>
        <article></article>
    </main>
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--padding-sm);
        gap: var(--padding-sm);
        width: 100%;
        height: 100vh;
        background: linear-gradient(to right top, #9309de 0%, rgba(147, 9, 222, 0.5) 100%),
            var(--colors-background, #fff);

        nav {
            height: 3.75rem;
            width: 100%;
            background: var(--background);
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            padding: 0 var(--padding-md);
        }

        main {
            display: flex;
            width: 100%;
            height: 100%;
            gap: var(--padding-sm);

            .contents {
                display: flex;
                width: 20rem;
                padding: var(--page-padding);
                flex-direction: column;
                align-items: flex-start;
                gap: 3rem;
                flex-shrink: 0;
                align-self: stretch;
                border-radius: 0.5rem;
                background: var(--background);
                overflow: auto;
            }

            article {
                width: 100%;
                height: 100%;
                padding: var(--page-padding);
                background: var(--background);
                border-radius: 0.5rem;
            }
        }
    }
</style>
