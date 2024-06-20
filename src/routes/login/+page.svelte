<div class="container">
    <div class="text-container">
        <h1>Log In</h1>
        <p>Welcome back! Please enter your login info.</p>
    </div>
    <div class="links">
        <p><a href='/signup'>Sign up instead</a></p>
        <p><a href='/forgot-password'>Forgot password?</a></p>
    </div>
</div>

<style lang="scss">
    .links {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;

        p {
            @include paragraph-sm;
        }
    }
</style>