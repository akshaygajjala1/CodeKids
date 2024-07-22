<script lang="ts">
    import LogoText from '../LogoText.svelte';

    export let hasReturnToTop: boolean = true;
</script>

<div class="container">
    <footer>
        <div class="logo-text">
            <LogoText />
            {#if hasReturnToTop}
                <p><a href="#top">Return to Top</a></p>
            {/if}
        </div>
        <div class="nav-links">
            <p><a href="/#">Home</a></p>
            <p><a href="/#about">About</a></p>
            <p><a href="/#meet-the-tutors">Meet the Tutors</a></p>
            <p><a href="/#contact-us">Contact Us</a></p>
        </div>
        <p class="info">
            ©️ CodeKids Academy 2024. Designed from scratch using Figma and developed & architected
            by <a href="https://pranav-pakanati.netlify.app">Pranav Pakanati</a> with SvelteKit, TypeScript,
            and Docker. Content developed by Akshay Gajjala, and Ram Sarma.
        </p>
    </footer>
</div>

<style lang="scss">
    .container {
        width: 100%;
        display: flex;
        max-width: 90rem;
        margin: 0 auto;
        padding: 0 var(--page-padding) var(--page-padding) var(--page-padding);
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;

        footer {
            display: flex;
            padding-top: var(--padding-3xl);
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: var(--padding-lg);
            align-self: stretch;
            border-top: 1px solid var(--light-gray);

            a {
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }

            .logo-text {
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: var(--padding-2xl);
                row-gap: var(--padding-sm);

                p {
                    text-align: end;
                    @include paragraph-md;
                }
            }

            .nav-links {
                display: flex;
                gap: var(--padding-lg);

                p {
                    @include paragraph-md;
                }
            }

            .info {
                color: var(--gray);
                max-width: 64rem;
                text-wrap: balance;
                @include paragraph-sm;

                a {
                    text-decoration: underline;
                }
            }

            @media screen and (max-width: 27.5rem) {
                .nav-links {
                    flex-direction: column;
                    gap: var(--padding-sm);
                }
            }
        }
    }
</style>
