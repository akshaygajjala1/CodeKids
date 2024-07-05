<script lang="ts">
    import { enhance } from '$app/forms';
    import FormButton from '$lib/components/FormButton.svelte';
    import FormField from '$lib/components/FormField.svelte';
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { SvelteComponent } from 'svelte';

    let password: string = '';
    let confirmPassword: string = '';

    let confPassErrText: string = 'Enter a password.';

    let passwordComponent: SvelteComponent;
    let confirmPasswordComponent: SvelteComponent;

    const setConfPassErrText = () => {
        if (confirmPassword === '') {
            confPassErrText = 'Enter a password.';
        } else {
            confPassErrText = 'Passwords must match.';
        }
    };
    const enhanced: SubmitFunction = ({ cancel }) => {
        setConfPassErrText();
        const fields = [passwordComponent, confirmPasswordComponent];
        const isValid = fields.reduce((allValid, field) => field.checkValidity() && allValid, true);
        if (!isValid) {
            cancel();
        }
        return async ({ result, update }) => {
            update();
        };
    };
</script>

<form method="POST" class="container" novalidate use:enhance={enhanced}>
    <div class="text-container">
        <h1>Reset Password</h1>
        <p>Enter a new password below.</p>
    </div>
    <div class="fields">
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
    <FormButton>Reset Password</FormButton>
</form>
