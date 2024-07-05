<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="container">
    <div class="text-container">
        <h1>Forgot Password</h1>
        <p>
            We've sent an email to {data.email.trim()}. Please click on the link in the email to
            reset your password. You may close this tab.
        </p>
    </div>
    <div class="links">
        <p>
            <a href="/forgot-password">Go back</a>
        </p>
    </div>
</div>

<style lang="scss">
    .links {
        display: flex;
        justify-content: left;
        align-self: stretch;

        p {
            @include paragraph-sm;
        }
    }
</style>
