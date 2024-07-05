<script lang="ts">
    import FormButton from '$lib/components/FormButton.svelte';
    import FormField from '$lib/components/FormField.svelte';
    import { emailRegex } from '$lib/helpers/regex';
    import type { SvelteComponent } from 'svelte';
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';

    let email: string = '';

    let errorText: string = 'Please enter a valid email.';

    let emailComponent: SvelteComponent;

    const resetErrorText = () => {
        errorText = 'Please enter a valid email.';
    };

    const enhanced: SubmitFunction = ({ cancel }) => {
        if (email === '') {
            emailComponent.setValidity('error');
            errorText = 'Please enter a valid email.';
            cancel();
        }
        const isValid = emailComponent.checkValidity();
        if (!isValid) {
            cancel();
        }

        return async ({ result, update }) => {
            if (result.type === 'failure') {
                errorText = result.data?.error;
                emailComponent.setValidity('error');
            } else {
                console.log(result.status);
                update();
            }
        };
    };
</script>

<form method="POST" class="container" novalidate use:enhance={enhanced}>
    <div class="text-container">
        <h1>Forgot Password</h1>
        <p>
            To reset your password, enter your email address. Then, click on the link in the email
            you receieve.
        </p>
    </div>
    <div class="fields">
        <FormField
            fieldName="Email"
            fieldType="email"
            placeholder="email@domain.com"
            bind:value={email}
            bind:this={emailComponent}
            {errorText}
            validate={(value) => emailRegex.exec(value) !== null}
            on:input={resetErrorText}
        />
    </div>
    <div class="links">
        <p><a href="/login">Go back</a></p>
    </div>
    <FormButton>Send Email</FormButton>
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
