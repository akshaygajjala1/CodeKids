<script>
	import HomeMainAction from './HomeMainAction.svelte';
</script>

<nav>
    <div class="logo-text-container">
        <h3><a href='/'>CodeKids Academy</a></h3>
    </div>
    <div class="nav-links">
        <p><a href='/#'>Home</a></p>
        <p><a href='/#about'>About</a></p>
        <p><a href='/#meet-the-tutors'>Meet the Tutors</a></p>
        <p><a href='/#contact-us'>Contact Us</a></p>
    </div>
    <div class="login-signup-links">
        <HomeMainAction loggedIn={false} />
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
        background: transparent;
        backdrop-filter: blur(24px);

        .logo-text-container {
            flex: 1 0 0;

            a {
                text-decoration: none;
                color: inherit;

                &:visited {
                    color: inherit;
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
                color: var(--gray);
                white-space: nowrap;

                a {
                    text-decoration: none;
                    color: inherit;

                    &:visited {
                        color: inherit;
                    }

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
    }
</style>
