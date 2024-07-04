<script lang="ts">
    import { enhance } from '$app/forms';
    import FormButton from '$lib/components/FormButton.svelte';
    import FormField from '$lib/components/FormField.svelte';
    import { emailRegex } from '$lib/helpers/regex';
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { SvelteComponent } from 'svelte';

    let email: string = '';
    let name: string = '';
    let password: string = '';
    let confirmPassword: string = '';

    let confPassErrText: string = 'Enter a password.';
    let emailErrText: string = 'Please enter a valid email address.';

    let emailComponent: SvelteComponent;
    let nameComponent: SvelteComponent;
    let passwordComponent: SvelteComponent;
    let confirmPasswordComponent: SvelteComponent;

    const setConfPassErrText = () => {
        if (confirmPassword === '') {
            confPassErrText = 'Enter a password.';
        } else {
            confPassErrText = 'Passwords must match.';
        }
    };

    const resetEmailErrText = () => {
        emailErrText = 'Please enter a valid email address.';
    };

    const enhanced: SubmitFunction = ({ cancel }) => {
        setConfPassErrText();
        const fields = [nameComponent, emailComponent, passwordComponent, confirmPasswordComponent];
        const isValid = fields.reduce((allValid, field) => field.checkValidity() && allValid, true);
        if (!isValid) {
            cancel();
        }

        return async ({ result, update }) => {
            if (result.type === 'failure') {
                emailErrText = result.data?.error;
                emailComponent.setValidity('error');
            } else {
                update();
            }
        };
    };
</script>

<form method="POST" class="container" novalidate use:enhance={enhanced}>
    <div class="text-container">
        <h1>Sign Up</h1>
        <p>Hello! We're glad you're here. Please enter your information below.</p>
    </div>
    <div class="fields">
        <FormField
            fieldName="Name"
            placeholder="First Last"
            bind:value={name}
            bind:this={nameComponent}
            errorText="Names must be at least 2 characters."
            minLength={2}
            validate={(value) => value.replace(/\s+/, '').length >= 2}
        />
        <FormField
            fieldName="Email"
            fieldType="email"
            placeholder="email@domain.com"
            bind:value={email}
            bind:this={emailComponent}
            errorText={emailErrText}
            validate={(value) => emailRegex.exec(value) !== null}
            on:input={resetEmailErrText}
        />
        <FormField
            fieldName="Password"
            fieldType="password"
            placeholder="••••••••"
            bind:value={password}
            bind:this={passwordComponent}
            errorText="Passwords must be at least 8 characters long."
            minLength={8}
            validate={(value) => value.length >= 8}
            on:input={() => confirmPasswordComponent.checkValidity()}
        />
        <FormField
            fieldName="Confirm Password"
            fieldType="password"
            placeholder="••••••••"
            bind:value={confirmPassword}
            bind:this={confirmPasswordComponent}
            errorText={confPassErrText}
            minLength={8}
            validate={(value) => value === password && value.length > 0}
            on:input={setConfPassErrText}
        />
    </div>
    <div class="links">
        <p><a href="/login">Log in instead</a></p>
    </div>
    <FormButton>Sign Up</FormButton>
</form>

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
