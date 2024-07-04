<script lang="ts">
    import { fade } from 'svelte/transition';

    export let fieldName: string;
    export let placeholder: string = '';
    export let fieldType: 'text' | 'password' | 'tel' | 'email' | 'number' = 'text';
    export let value: string = '';
    export let minLength: number = 0;
    export let maxLength: number = 128;
    export let required: boolean = true;
    export let validate: (value: string) => boolean = () => true;
    export let manualValidationOnly: boolean = false;
    export let errorText: string = 'Invalid input';

    export const checkValidity = () => {
        if (!validate(value)) {
            status = 'error';
            return false;
        } else {
            status = 'success';
            return true;
        }
    };

    export const setValidity = (validity: 'normal' | 'success' | 'error') => {
        status = validity;
    };

    let status: 'normal' | 'success' | 'error' = 'normal';
    let input: HTMLInputElement;
</script>

<div class="form-field">
    <div class="text">
        <label for={fieldName}>{fieldName}</label>
        {#if status === 'error'}
            <p transition:fade={{ duration: 300 }}>{errorText}</p>
        {/if}
    </div>
    <input
        class={status}
        bind:value
        bind:this={input}
        name={fieldName}
        minlength={minLength}
        maxlength={maxLength}
        {required}
        {placeholder}
        {...{ type: fieldType }}
        {...$$restProps}
        on:focusout={() => {
            if (manualValidationOnly) {
                return;
            }
            if (status !== 'normal' || value.length > 0) {
                checkValidity();
            }
        }}
        on:input={() => {
            if (manualValidationOnly) {
                return;
            }
            if (status !== 'normal') {
                checkValidity();
            }
        }}
        on:input
        on:focusout
    />
</div>

<style lang="scss">
    .form-field {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: var(--padding-sm);

        .text {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            flex-wrap: wrap;
            column-gap: var(--padding-sm);

            label {
                @include paragraph-lg;
                color: var(--dark-gray);
                align-self: stretch;
                text-align: left;
            }

            p {
                @include paragraph-sm-b;
                color: var(--error);
            }
        }

        input {
            height: 2.5rem;
            padding: 0rem 0.625rem;
            border-radius: 0.5rem;
            @include paragraph-md;
            color: var(--gray);
            transition:
                300ms box-shadow ease,
                300ms border ease;

            &::placeholder {
                color: var(--light-gray);
            }

            &:focus-visible {
                outline: none;
            }

            &.normal {
                border: 1px solid var(--light-gray);

                &:focus-visible {
                    box-shadow: var(--shadow-outline-thick);
                }
            }

            &.success {
                border: 1px solid var(--success);

                &:focus-visible {
                    box-shadow: var(--shadow-outline-success);
                }
            }

            &.error {
                border: 1px solid var(--error);

                &:focus-visible {
                    box-shadow: var(--shadow-outline-error);
                }
            }
        }
    }
</style>
