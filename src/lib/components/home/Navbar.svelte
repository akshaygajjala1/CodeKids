<script lang='ts'>
    import { fly } from 'svelte/transition';

	import HomeMainAction from './MainAction.svelte';
	import LogoText from '../LogoText.svelte';
	import Logo from '../Logo.svelte';
	import { onMount } from 'svelte';

    let menuActive = false;

    const onResize = () => {
        const width = window.innerWidth / parseFloat(getComputedStyle(document.querySelector('html')!).fontSize);
        if (width > 64) {
            menuActive = false;
        }
    }

    const closeMenu = () => {
        menuActive = false;
    }

    onMount(() => {
        window.addEventListener('resize', () => {
            onResize();
        })

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
        <p><a href='/#'>Home</a></p>
        <p><a href='/#about'>About</a></p>
        <p><a href='/#meet-the-tutors'>Meet the Tutors</a></p>
        <p><a href='/#contact-us'>Contact Us</a></p>
    </div>
    <div class="login-signup-links">
        <HomeMainAction loggedIn={false} />
        <button id="menu-button" class={menuActive ? 'menu-active' : ''} on:click={() => menuActive = !menuActive}>
            <div id="menu-icon">
                <div id="menu-icon-bar-1"></div>
                <div id="menu-icon-bar-2">
                    <div id="menu-icon-bar-flip"></div>
                </div>
                <div id="menu-icon-bar-3"></div>
            </div>
        </button>
    </div>
</nav>
{#if menuActive}
    <aside in:fly={{ x: '100%', duration: 600 }} out:fly={{ x: '100%', duration: 600 }}>
        <p><a href='/#' on:click={closeMenu}>Home</a></p>
        <p><a href='/#about' on:click={closeMenu}>About</a></p>
        <p><a href='/#meet-the-tutors' on:click={closeMenu}>Meet the Tutors</a></p>
        <p><a href='/#contact-us' on:click={closeMenu}>Contact Us</a></p>
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

        .logo-text-container {
            flex: 1 0 0;

            #logo-visibility {
                display: none;
            }

            @media screen and (max-width: 34rem) {
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
                @include paragraph-md;
                white-space: nowrap;

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

            #menu-button {
                border: none;
                background: none;
                cursor: pointer;
                display: none;
                place-items: center;
                padding: 0.375rem var(--padding-md);
                margin-left: var(--padding-smd);
                border-radius: 1rem;
                transition: background-color 600ms ease, box-shadow 600ms ease;

                &:hover {
                    box-shadow: var(--shadow-sm-light);
                }

                &:active {
                    box-shadow: var(--shadow-sm-medium);
                }

                #menu-icon {
                    width: 1.25rem;
                    height: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: space-around;

                    div {
                        background-color: var(--secondary);
                        height: calc(1.6rem / 16);
                        transition: background-color 600ms ease, opacity 600ms ease, transform 500ms ease;
                    }
                }

                &.menu-active {
                    background: var(--secondary);

                    &:hover {
                        box-shadow: var(--shadow-sm-heavy);
                    }

                    &:active {
                        box-shadow: var(--shadow-sm-black);
                    }
                    
                    #menu-icon {
                        #menu-icon-bar-2, #menu-icon-bar-flip {
                            background-color: var(--background);
                        }

                        #menu-icon-bar-2 {
                            transform: rotate(45deg);
                        }

                        #menu-icon-bar-flip {
                            transform: rotate(-90deg);
                        }

                        #menu-icon-bar-1, #menu-icon-bar-3 {
                            opacity: 0;
                        }
                    }
                }
            }
        }

        @media screen and (max-width: 64rem) {
            .nav-links {
                display: none;
            }

            .login-signup-links {
                flex: unset;

                #menu-button {
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
