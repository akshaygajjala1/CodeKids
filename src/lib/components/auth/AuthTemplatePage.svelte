<script>
    import LogoText from '../LogoText.svelte';
</script>

<div class="container">
    <div class="form-container">
        <div class="logo-text">
            <LogoText />
        </div>
        <slot />
    </div>
    <div class="background"></div>
</div>

<style lang="scss">
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;

        .form-container {
            display: grid;
            position: relative;
            width: 40rem;
            height: 100vh;
            padding: 5.9375rem 5rem;
            overflow: auto;

            .logo-text {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                display: flex;
                align-items: center;
                padding: var(--page-padding);
            }

            :global(.container) {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: var(--padding-xl);
                flex: 1 0 0;
                align-self: stretch;
            }

            :global(.text-container) {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: var(--padding-smd);
                align-self: stretch;
                text-align: left;
            }

            :global(.text-container > *) {
                align-self: stretch;
            }

            :global(.fields) {
                display: flex;
                width: 100%;
                flex-direction: column;
                gap: var(--padding-md);
            }

            @media screen and (max-width: 40rem) {
                padding: 5.9375rem var(--page-padding);
            }
        }

        .background {
            height: 100vh;
            flex: 1 0 0;
            align-self: stretch;
            background: linear-gradient(31deg, rgba(147, 9, 222, 0.5) 0%, #9309de 100%);
        }
    }
</style>
