<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { highlighter } from '$lib/helpers/shiki';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { toTitleCase } from '$lib/helpers/functions';

    import logoSrc from '$lib/assets/CodeKidsAcademy Logo.png';
    import copySrc from '$lib/assets/icons/copy.png';

    export let fixedHeight: number | undefined = undefined;
    export let fixedOutputHeight: number | undefined = undefined;

    let data: HTMLElement;
    let text: string;
    let textarea: HTMLTextAreaElement;
    let initialText: string;
    let outputText: string = 'Output (try running the code)';
    let outputType: 'success' | 'error' | 'timeout' | undefined = undefined;
    let outputTime: number | undefined = undefined;
    let copyText: string = 'Copy';

    const setHighlightedText = () => {
        data.innerHTML = highlighter.codeToHtml(text, {
            lang: 'python',
            theme: 'snazzy-light'
        });
    };

    const runCode = async () => {
        try {
            const response = await fetch($page.url.origin + '/python-api/sandbox', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: text })
            });
            if (!response.ok) {
                throw new Error('Failed to run code');
            }
            const data = await response.json();
            outputText = data.output;
            outputType = data.status;
            outputTime = data.time;
        } catch (err) {
            if (err instanceof Error) alert('An unexpected error occurred. ' + err.message);
            else alert('An unexpected error occurred.');
        }
    };

    const handleTab = (e: Event) => {
        if ('key' in e && e.key == 'Tab') {
            e.preventDefault();
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;

            textarea.value =
                textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);

            textarea.selectionStart = textarea.selectionEnd = start + 4;
            text = textarea.value;
            setHighlightedText();
        }
    };

    onMount(() => {
        text = data?.innerText;
        initialText = text;
        textarea.value = text;
        textarea.onkeydown = handleTab;
    });
</script>

<div class="container">
    <div class="language-info">
        <p>Python 3.8.10</p>
        <Button variant="secondary" on:click={() => {
            try {
                navigator.clipboard.writeText(text);
                copyText = 'Copied!';
            }
            catch (err) {
                alert('There was an error copying the code.');
            }
        }}>
            <span>{copyText}</span>
            <img src={copySrc} alt="copy" />
        </Button>
    </div>
    <div
        class="editable-code-container"
        style={fixedHeight ? `height: calc(${fixedHeight} * 1.5rem + 2 * var(--padding-xl))` : ''}
    >
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
                    copyText = 'Copy';
                    setHighlightedText();
                }}
            ></textarea>
        </div>
    </div>
    <div class="output">
        <pre
            style={fixedOutputHeight
                ? `height: calc(1.5rem * ${fixedOutputHeight} + 2 * var(--padding-xl));`
                : ''}>
            <code class={outputType}>{outputText}</code>
        </pre>
    </div>
    <div class="controls">
        <Button on:click={runCode}>
            <img src={logoSrc} alt="Logo" />
            <span>Run</span>
        </Button>
        <Button
            variant="ghost"
            on:click={() => {
                text = initialText;
                outputText = 'Output (try running the code)';
                outputType = undefined;
                outputTime = undefined;
                textarea.value = text;
                copyText = 'Copy';
                setHighlightedText();
            }}
        >
            Reset
        </Button>
        {#if outputType && outputTime}
            {#if outputType === 'timeout'}
                <p class={outputType}>{`${toTitleCase(outputType)} • >2s`}</p>
            {:else}
                <p class={outputType}>
                    {`${toTitleCase(outputType)} • ${(outputTime * 1000).toFixed(3)}ms`}
                </p>
            {/if}
        {/if}
    </div>
</div>

<style lang="scss">
    .container {
        display: grid;
        border: 2px solid var(--primary);
        border-radius: 0.5rem;

        .language-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--padding-smd) var(--padding-xl);
            box-shadow: 0 0.125rem 0.125rem rgba(0, 0, 0, 0.075);

            p {
                color: var(--text);
                @include paragraph-sm-b;
            }

            :global(img) {
                filter: brightness(100%);
            }
        }

        .output {
            overflow: auto;

            pre {
                padding: var(--padding-xl);
                background-color: rgb(249, 249, 249) !important;
                display: grid;
                width: auto;

                code {
                    font-size: 1.125rem;
                    line-height: 1.5rem;
                    width: auto;
                    min-width: max-content;
                    padding: 0;
                    font-family: monospace;
                    color: var(--light-gray);

                    &.error,
                    &.timeout {
                        color: var(--error);
                    }

                    &.success {
                        color: var(--gray);
                    }
                }
            }
        }

        .controls {
            padding: var(--padding-xl);
            display: flex;
            align-items: center;
            gap: var(--padding-smd);
            flex-wrap: wrap;

            p {
                flex: 1 0 0;
                text-align: end;
                @include paragraph-sm-b;

                & {
                    line-height: 1;
                }

                &.success {
                    color: #2dae58;
                }

                &.error,
                &.timeout {
                    color: var(--error);
                }
            }
        }
    }

    .editable-code-container {
        display: grid;
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
            resize: none;

            &:focus-visible {
                outline: none;
            }
        }
    }
</style>
