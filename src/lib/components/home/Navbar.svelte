<script>
	import HomeMainAction from './MainAction.svelte';
	import LogoText from '../LogoText.svelte';
	import Logo from '../Logo.svelte';

    let menuActive = false;
</script>

<nav>
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
</style>
