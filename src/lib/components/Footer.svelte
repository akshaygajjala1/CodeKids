<script lang="ts">
    export let hasReturnToTop: boolean = true;
</script>

<div class="container">
    <footer>
        <div class="logo-text">
            <h3><a href='/'>CodeKids Academy</a></h3>
            {#if hasReturnToTop}
                <p><a href='#top'>Return to Top</a></p>
            {/if}
        </div>
        <div class="nav-links">
            <p><a href='/#'>Home</a></p>
            <p><a href='/#about'>About</a></p>
            <p><a href='/#meet-the-tutors'>Meet the Tutors</a></p>
            <p><a href='/#contact-us'>Contact Us</a></p>
        </div>
        <p class="info">
            ©️ CodeKids Academy 2024.  Created using SvelteKit & Typescript. Designed from scratch in Figma. Developed by <a href='https://pranav-pakanati.netlify.app'>Pranav Pakanati</a>, Akshay Gajjala, and Ram Sarma. 
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
                color: inherit;

                &:hover {
                    text-decoration: underline;
                }
            }

            .logo-text {
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;

                h3 a:hover {
                    text-decoration: none;
                }

                p {
                    text-align: end;
                    color: var(--gray);
                    @include paragraph-md;
                }
            }

            .nav-links {
                display: flex;
                gap: var(--padding-lg);
                color: var(--gray);

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
                .logo-text {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: var(--padding-sm);
                }

                .nav-links {
                    flex-direction: column;
                    gap: var(--padding-sm);
                }
            }
        }
    }
</style>