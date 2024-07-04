<script lang="ts">
    import FormField from '$lib/components/FormField.svelte';
    import FormButton from '$lib/components/FormButton.svelte';
    import type { SvelteComponent } from 'svelte';
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';

    let errorText: string = 'Invalid email / password.';

    let email: string = '';
    let password: string = '';

    let emailComponent: SvelteComponent;
    let passwordComponent: SvelteComponent;

    const resetValidity = () => {
        if (
            (errorText === 'Missing fields.' && email !== '' && password !== '') ||
            errorText !== 'Missing fields.'
        ) {
            emailComponent.setValidity('normal');
            passwordComponent.setValidity('normal');
        }
    };

    const enhanced: SubmitFunction = ({ cancel }) => {
        if (email === '' || password === '') {
            emailComponent.setValidity('error');
            passwordComponent.setValidity('error');
            errorText = 'Missing fields.';
            cancel();
        }

        return async ({ result, update }) => {
            if (result.type === 'failure') {
                errorText = result.data?.error;
                emailComponent.setValidity('error');
                passwordComponent.setValidity('error');
            } else {
                update();
            }
        };
    };
</script>

<form class="container" method="POST" novalidate use:enhance={enhanced}>
    <div class="text-container">
        <h1>Log In</h1>
        <p>Welcome back! Please enter your login info.</p>
    </div>
    <div class="fields">
        <FormField
            fieldName="Email"
            fieldType="email"
            placeholder="email@domain.com"
            bind:value={email}
            bind:this={emailComponent}
            manualValidationOnly={true}
            {errorText}
            on:input={resetValidity}
        />
        <FormField
            fieldName="Password"
            fieldType="password"
            placeholder="••••••••"
            bind:value={password}
            bind:this={passwordComponent}
            manualValidationOnly={true}
            errorText=""
            on:input={resetValidity}
        />
    </div>
    <div class="links">
        <p><a href="/signup">Sign up instead</a></p>
        <p><a href="/forgot-password">Forgot password?</a></p>
    </div>
    <FormButton>Log In</FormButton>
</form>

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
