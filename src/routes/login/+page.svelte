<script lang='ts'>
	import FormField, { type FieldValue } from "$lib/components/FormField.svelte";
    import FormButton from '$lib/components/FormButton.svelte';
	import type { SvelteComponent } from "svelte";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";

    let errorText: string = 'Invalid email / password.';

    let emailStatus: FieldValue = { text: '', isValid: false }
    let passwordStatus: FieldValue = { text: '', isValid: false }

    let email: SvelteComponent;
    let password: SvelteComponent;

    const resetValidity = () => {
        email.setValidity('normal');
        password.setValidity('normal');
    }

    const enhanced: SubmitFunction = () => {
        return async ({ result, update }) => {
            if (result.type === 'failure') {
                errorText = result.data?.error;
                email.setValidity('error');
                password.setValidity('error');
            } else {
                update();
            }
        }
    }
</script>

<form class="container" method='POST' novalidate use:enhance={enhanced}>
    <div class="text-container">
        <h1>Log In</h1>
        <p>Welcome back! Please enter your login info.</p>
    </div>
    <div class="fields">
        <FormField
            fieldName="Email"
            fieldType="email"
            placeholder="email@domain.com"
            bind:value={emailStatus}
            bind:this={email}
            manualValidationOnly={true}
            errorText={errorText}
            on:input={resetValidity}
        />
        <FormField 
            fieldName='Password'
            fieldType='password'
            placeholder='••••••••'
            bind:value={passwordStatus}
            bind:this={password}
            manualValidationOnly={true}
            errorText=''
            on:input={resetValidity}
        />
    </div>
    <div class="links">
        <p><a href='/signup'>Sign up instead</a></p>
        <p><a href='/forgot-password'>Forgot password?</a></p>
    </div>
    <FormButton>
        Log In
    </FormButton>
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