<script lang="ts">
    import { highlighter } from '$lib/helpers/shiki';
    import { onMount } from 'svelte';

    export let fixedHeight: number | undefined = undefined;

    let data: HTMLElement;
    let text: string;
    let textarea: HTMLTextAreaElement;

    let initialText: string;

    onMount(() => {
        text = data?.innerText;
        initialText = text;
        textarea.value = text;
    })
</script>

<div class="container" style={fixedHeight ? `height: calc(${fixedHeight} * 1.5rem + 2 * var(--padding-xl))` : ''}>
    <div class="editable-code-container">
        <div class="editable-code">
            <span bind:this={data}>
                <slot />
            </span>
            <textarea
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                bind:this={textarea}
                on:input={() => {
                    text = textarea.value;
                    data.innerHTML = highlighter.codeToHtml(text, {
                        lang: 'python',
                        theme: 'snazzy-light'
                    });
                }}
            ></textarea>
        </div>
    </div>
</div>

<style lang="scss">
    .container {
        display: grid;
    }

    .editable-code-container {
        display: grid;
        outline: 2px solid var(--primary);
        border-radius: 0.5rem;
        overflow: auto;
    }

    .editable-code {
        position: relative;
        
        & > span {
            width: auto;
            max-width: 100%;

            :global(.code-container) {
                border: none;
                width: auto;
            }

            :global(.shiki) {
                width: auto;
                overflow: visible;
            }
        }

        textarea {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            padding: var(--padding-xl);
            font-size: 1.125rem;
            line-height: 1.5rem;
            font-family: monospace;
            color: transparent;
            caret-color: var(--gray);

            &:focus-visible {
                outline: none;
            }
        }
    }
</style>
