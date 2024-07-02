<script lang="ts">
	import FormButton from '$lib/components/FormButton.svelte';
    import FormField, { type FieldValue } from '$lib/components/FormField.svelte';
	import type { SvelteComponent } from 'svelte';

	const emailRegex =
		/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
	let emailStatus: FieldValue = { text: '', isValid: false };
	let nameStatus: FieldValue = { text: '', isValid: false };
	let passwordStatus: FieldValue = { text: '', isValid: false };
	let confirmPasswordStatus: FieldValue = { text: '', isValid: false };

	let email: SvelteComponent;
	let name: SvelteComponent;
	let password: SvelteComponent;
	let confirmPassword: SvelteComponent;

    let form: HTMLFormElement;

    const handleSubmit = () => {
        const fields = [name, email, password, confirmPassword];
        const isValid = fields.reduce((allValid, field) => field.checkValidity() && allValid, true);
        if (isValid) {
            form.submit();
        }
    }
</script>

<form method='POST' class="container" bind:this={form}>
	<div class="text-container">
		<h1>Sign Up</h1>
		<p>Hello! We're glad you're here. Please enter your information below.</p>
	</div>
	<div class="fields">
		<FormField
			fieldName="Name"
			placeholder="First Last"
			bind:value={nameStatus}
            bind:this={name}
			errorText="Names must be longer than 2 characters."
			minLength={2}
			validate={(value) => value.replace(/\s+/, '').length >= 2}
		/>
		<FormField
			fieldName="Email"
			fieldType="email"
			placeholder="email@domain.com"
			bind:value={emailStatus}
            bind:this={email}
			errorText="Please enter a valid email address."
			validate={(value) => emailRegex.exec(value) !== null}
		/>
		<FormField
			fieldName="Password"
			fieldType="password"
			placeholder="••••••••"
			bind:value={passwordStatus}
            bind:this={password}
			errorText="Passwords must be at least 8 characters long."
			minLength={8}
			validate={(value) => value.length >= 8}
			on:input={() => confirmPassword.checkValidity()}
		/>
		<FormField
			fieldName="Confirm Password"
			fieldType="password"
			placeholder="••••••••"
			bind:value={confirmPasswordStatus}
			bind:this={confirmPassword}
			errorText="Passwords must match."
			minLength={8}
			validate={(value) => value === passwordStatus.text && value.length > 0}
		/>
	</div>
	<div class="links">
		<p><a href="/login">Log in instead</a></p>
	</div>
    <FormButton on:click={handleSubmit}>
        Sign Up
    </FormButton>
</form>

<style lang="scss">
	.fields {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: var(--padding-md);
	}

	.links {
		display: flex;
		justify-content: left;
		align-self: stretch;

		p {
			@include paragraph-sm;
		}
	}
</style>
