<script>
    import Button from '$lib/components/Button.svelte';
</script>

<nav>
    <div class="logo-text-container">
        <h3>CodeKids Academy</h3>
    </div>
    <div class="nav-links">
        <p><a href='/#'>Home</a></p>
        <p><a href='/#about'>About</a></p>
        <p><a href='/#meet-the-tutors'>Meet the Tutors</a></p>
        <p><a href='/#contact-us'>Contact Us</a></p>
    </div>
    <div class="login-signup-links">
        <Button variant='ghost'><a href='/login'>Log In</a></Button>
        <Button variant='secondary'><a href='/signup'>Sign Up</a></Button>
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
        backdrop-filter: blur(24px);

        .logo-text-container {
            flex: 1 0 0;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: var(--padding-lg);
            align-self: stretch;

            p {
                @include paragraph-md;
                color: var(--gray);

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
            gap: var(--padding-smd);
            flex: 1 0 0;
            align-self: stretch;
        }
    }
</style>
