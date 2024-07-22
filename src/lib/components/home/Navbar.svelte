<script lang="ts">
    import { fly } from 'svelte/transition';

    import HomeMainAction from './MainAction.svelte';
    import MenuToggle from '../MenuToggle.svelte';
    import LogoText from '../LogoText.svelte';
    import Logo from '../Logo.svelte';
    import { onMount } from 'svelte';

    export let loggedIn: boolean;
    let menuActive = false;
    let width: number;

    const onResize = () => {
        width =
            window.innerWidth /
            parseFloat(getComputedStyle(document.querySelector('html')!).fontSize);
        if (width > 64) {
            menuActive = false;
        }
    };

    const closeMenu = () => {
        menuActive = false;
    };

    onMount(() => {
        window.addEventListener('resize', () => {
            onResize();
        });

        return () => window.removeEventListener('resize', onResize);
    });
</script>

<nav class={menuActive ? 'menu-active' : ''}>
    <div class="logo-text-container">
        <div id="logo-visibility">
            <Logo />
        </div>
        <div id="logo-text-visibility">
            <LogoText />
        </div>
    </div>
    <div class="nav-links">
        <p><a href="/#">Home</a></p>
        <p><a href="/#about">About</a></p>
        <p><a href="/#meet-the-tutors">Meet the Tutors</a></p>
        <p><a href="/#contact-us">Contact Us</a></p>
    </div>
    <div class="login-signup-links">
        <HomeMainAction {loggedIn} hideSignOut={width < 24} />
        <MenuToggle bind:menuActive />
    </div>
</nav>
{#if menuActive}
    <aside in:fly={{ x: '100%', duration: 600 }} out:fly={{ x: '100%', duration: 600 }}>
        <p><a href="/#" on:click={closeMenu}>Home</a></p>
        <p><a href="/#about" on:click={closeMenu}>About</a></p>
        <p><a href="/#meet-the-tutors" on:click={closeMenu}>Meet the Tutors</a></p>
        <p><a href="/#contact-us" on:click={closeMenu}>Contact Us</a></p>
    </aside>
{/if}

<style lang="scss">
    nav {
        display: flex;
        height: 3.75rem;
        padding: 0rem var(--padding-md);
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        position: fixed;
        top: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.4);
        transition: background 600ms ease;
        backdrop-filter: blur(12px);
        z-index: 5;

        .logo-text-container {
            flex: 1 0 0;

            #logo-visibility {
                display: none;
            }

            @media screen and (max-width: 39rem) {
                #logo-visibility {
                    display: block;
                }

                #logo-text-visibility {
                    display: none;
                }
            }
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: var(--padding-lg);
            flex: 1 0 0;
            justify-content: center;
            align-self: stretch;

            p {
                white-space: nowrap;
                @include paragraph-md;

                a {
                    text-decoration: none;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }

        .login-signup-links {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            flex: 1 0 0;
            align-self: stretch;
        }

        @media screen and (max-width: 64rem) {
            .nav-links {
                display: none;
            }

            .login-signup-links {
                flex: unset;

                :global(#menu-button) {
                    display: grid;
                }
            }
        }
    }

    nav.menu-active {
        background: var(--background);
    }

    aside {
        position: fixed;
        top: 3.75rem;
        right: 0;
        bottom: 0;
        width: 20rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: var(--padding-3xl) var(--page-padding);
        gap: var(--padding-3xl);
        background: var(--background);
        overflow: auto;

        @media screen and (max-width: 27.5rem) {
            width: 100%;
        }
    }
</style>
